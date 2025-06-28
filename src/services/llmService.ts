import { LLMConfig, LLMProvider, AIAnalysisRequest, AIAnalysisResponse } from '../types';
import { getProviderById } from '../data/llmProviders';

export class LLMService {
  private config: LLMConfig;
  private provider: LLMProvider;

  constructor(config: LLMConfig) {
    this.config = config;
    const provider = getProviderById(config.providerId);
    if (!provider) {
      throw new Error(`Provider ${config.providerId} not found`);
    }
    this.provider = provider;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.provider.requiresAuth) {
      switch (this.provider.authType) {
        case 'bearer':
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
          break;
        case 'api-key':
          if (this.provider.headerName) {
            headers[this.provider.headerName] = this.config.apiKey;
          } else {
            headers['X-API-Key'] = this.config.apiKey;
          }
          break;
        case 'custom':
          // Handle custom auth if needed
          break;
      }
    }

    // Add provider-specific headers
    if (this.provider.id === 'anthropic') {
      headers['anthropic-version'] = '2023-06-01';
    }

    return headers;
  }

  private formatPrompt(request: AIAnalysisRequest): string {
    const basePrompt = `You are a cybersecurity expert specializing in OSINT (Open Source Intelligence) analysis. 

Input: ${request.input}
Input Type: ${request.inputType}
Analysis Type: ${request.analysisType}
${request.context ? `Context: ${request.context}` : ''}

Please provide a comprehensive analysis including:
1. Risk assessment and threat level
2. Relevant indicators of compromise (IOCs)
3. Recommended investigation tools and techniques
4. Next steps for further analysis
5. Confidence level in your assessment

Format your response as a structured analysis that would be useful for a cybersecurity investigator.`;

    return basePrompt;
  }

  private getCacheKey(request: AIAnalysisRequest): string {
    return `ai-analysis-${btoa(JSON.stringify({
      input: request.input,
      inputType: request.inputType,
      analysisType: request.analysisType,
      providerId: this.config.providerId,
      modelId: this.config.modelId
    }))}`;
  }

  private getCachedResponse(cacheKey: string): AIAnalysisResponse | null {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        // Check if cache is still valid (e.g., less than 1 hour old)
        const cacheAge = Date.now() - parsedCache.timestamp;
        if (cacheAge < 3600000) { // 1 hour
          console.log('Using cached AI analysis response');
          return parsedCache.data;
        } else {
          // Remove expired cache
          sessionStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.warn('Error reading cached response:', error);
    }
    return null;
  }

  private setCachedResponse(cacheKey: string, response: AIAnalysisResponse): void {
    try {
      const cacheData = {
        data: response,
        timestamp: Date.now()
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error caching response:', error);
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(`${this.provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: this.config.modelId,
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity expert specializing in OSINT analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch(`${this.provider.baseUrl}/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: this.config.modelId,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || 'No response generated';
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(
      `${this.provider.baseUrl}/models/${this.config.modelId}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxTokens
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
  }

  private async callDeepSeek(prompt: string): Promise<string> {
    const response = await fetch(`${this.provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: this.config.modelId,
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity expert specializing in OSINT analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  }

  private async callCustomAPI(prompt: string): Promise<string> {
    const endpoint = this.config.customEndpoint || `${this.provider.baseUrl}/chat/completions`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: this.config.modelId,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || data.response || 'No response generated';
  }

  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const cacheKey = this.getCacheKey(request);
    
    // Check for cached response first
    const cachedResponse = this.getCachedResponse(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const prompt = this.formatPrompt(request);
      let analysisText: string;

      switch (this.provider.id) {
        case 'openai':
          analysisText = await this.callOpenAI(prompt);
          break;
        case 'anthropic':
          analysisText = await this.callAnthropic(prompt);
          break;
        case 'google':
          analysisText = await this.callGemini(prompt);
          break;
        case 'deepseek':
          analysisText = await this.callDeepSeek(prompt);
          break;
        default:
          analysisText = await this.callCustomAPI(prompt);
      }

      // Parse the response and extract structured information
      const response = this.parseAnalysisResponse(analysisText, request);
      
      // Cache the response
      this.setCachedResponse(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('LLM Analysis error:', error);
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseAnalysisResponse(analysisText: string, request: AIAnalysisRequest): AIAnalysisResponse {
    // Extract risk level
    const riskLevel = this.extractRiskLevel(analysisText);
    
    // Extract confidence
    const confidence = this.extractConfidence(analysisText);
    
    // Extract indicators
    const indicators = this.extractIndicators(analysisText);
    
    // Extract recommendations
    const recommendations = this.extractRecommendations(analysisText, request);
    
    // Extract next steps
    const nextSteps = this.extractNextSteps(analysisText);

    return {
      analysis: analysisText,
      confidence,
      recommendations,
      indicators,
      riskLevel,
      nextSteps
    };
  }

  private extractRiskLevel(text: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('critical') || lowerText.includes('severe')) return 'critical';
    if (lowerText.includes('high risk') || lowerText.includes('dangerous')) return 'high';
    if (lowerText.includes('medium') || lowerText.includes('moderate')) return 'medium';
    return 'low';
  }

  private extractConfidence(text: string): number {
    const confidenceMatch = text.match(/confidence[:\s]*(\d+)%?/i);
    if (confidenceMatch) {
      return parseInt(confidenceMatch[1]) / 100;
    }
    return 0.8; // Default confidence
  }

  private extractIndicators(text: string): string[] {
    const indicators: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('indicator') || line.toLowerCase().includes('ioc')) {
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
        if (cleanLine.length > 10) {
          indicators.push(cleanLine);
        }
      }
    }
    
    return indicators.slice(0, 5); // Limit to 5 indicators
  }

  private extractRecommendations(text: string, request: AIAnalysisRequest): AIRecommendation[] {
    // Simple recommendation extraction - in a real implementation, this would be more sophisticated
    const tools = this.extractRecommendedTools(text);
    
    return [{
      tools,
      reasoning: 'Based on AI analysis of the input and threat assessment',
      confidence: 0.8,
      steps: this.extractNextSteps(text).slice(0, 3)
    }];
  }

  private extractRecommendedTools(text: string): string[] {
    const toolKeywords = [
      'virustotal', 'shodan', 'urlscan', 'abuseipdb', 'greynoise',
      'hybrid-analysis', 'any-run', 'threatminer', 'securitytrails'
    ];
    
    const foundTools: string[] = [];
    const lowerText = text.toLowerCase();
    
    for (const tool of toolKeywords) {
      if (lowerText.includes(tool.replace('-', ' ')) || lowerText.includes(tool)) {
        foundTools.push(tool);
      }
    }
    
    return foundTools.slice(0, 5);
  }

  private extractNextSteps(text: string): string[] {
    const steps: string[] = [];
    const lines = text.split('\n');
    
    let inStepsSection = false;
    for (const line of lines) {
      if (line.toLowerCase().includes('next step') || line.toLowerCase().includes('recommend')) {
        inStepsSection = true;
        continue;
      }
      
      if (inStepsSection && (line.match(/^\d+\./) || line.match(/^[-*]/))) {
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
        if (cleanLine.length > 10) {
          steps.push(cleanLine);
        }
      }
    }
    
    return steps.slice(0, 5);
  }

  async testConnection(): Promise<boolean> {
    try {
      const testRequest: AIAnalysisRequest = {
        input: 'test',
        inputType: 'test',
        analysisType: 'general-inquiry'
      };
      
      await this.analyze(testRequest);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}