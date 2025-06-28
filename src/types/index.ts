export interface OSINTTool {
  id: string;
  name: string;
  url: string;
  originalUrl?: string; // Store original URL for proper reset
  description: string;
  tags: string[];
  category: string;
  isStandalone?: boolean;
  template?: string;
  status?: 'online' | 'offline' | 'slow' | 'unknown';
  usageCount?: number;
  lastUsed?: Date;
  notes?: ToolNote[];
}

export interface ToolNote {
  id: string;
  content: string;
  purpose: string;
  timestamp: Date;
  tags: string[];
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  tools: OSINTTool[];
}

export interface SearchQuery {
  input: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'unknown';
  timestamp: Date;
}

export interface InvestigationHistory {
  id: string;
  input: string;
  type: string;
  timestamp: Date;
  toolsUsed: string[];
  notes?: string;
}

export interface AIRecommendation {
  tools: string[];
  reasoning: string;
  confidence: number;
  steps: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  favoriteTools: string[];
  toolOrder: Record<string, string[]>;
  recentSearches: SearchQuery[];
  workspaceLayout: 'grid' | 'list' | 'compact';
  viewMode: 'card' | 'list';
  investigationHistory: InvestigationHistory[];
}

export interface LLMProvider {
  id: string;
  name: string;
  baseUrl: string;
  models: LLMModel[];
  requiresAuth: boolean;
  authType: 'bearer' | 'api-key' | 'custom';
  headerName?: string;
  isCustom?: boolean;
}

export interface LLMModel {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  costPer1kTokens?: number;
  capabilities: string[];
}

export interface LLMConfig {
  providerId: string;
  modelId: string;
  apiKey: string;
  customEndpoint?: string;
  maxTokens: number;
  temperature: number;
  isActive: boolean;
}

export interface AIAnalysisRequest {
  input: string;
  inputType: string;
  context?: string;
  analysisType: 'threat-assessment' | 'ioc-analysis' | 'general-inquiry' | 'tool-recommendation';
}

export interface AIAnalysisResponse {
  analysis: string;
  confidence: number;
  recommendations: AIRecommendation[];
  indicators: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  nextSteps: string[];
  sources?: string[];
}