import { LLMProvider } from '../types';

export const defaultLLMProviders: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    requiresAuth: true,
    authType: 'bearer',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Most capable model for complex analysis',
        contextLength: 128000,
        costPer1kTokens: 0.005,
        capabilities: ['reasoning', 'analysis', 'code', 'multimodal']
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Fast and efficient for most tasks',
        contextLength: 128000,
        costPer1kTokens: 0.00015,
        capabilities: ['reasoning', 'analysis', 'code']
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Cost-effective for simple analysis',
        contextLength: 16385,
        costPer1kTokens: 0.0005,
        capabilities: ['reasoning', 'analysis']
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    requiresAuth: true,
    authType: 'api-key',
    headerName: 'x-api-key',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'Excellent for detailed analysis and reasoning',
        contextLength: 200000,
        costPer1kTokens: 0.003,
        capabilities: ['reasoning', 'analysis', 'code', 'research']
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Fast and efficient for quick analysis',
        contextLength: 200000,
        costPer1kTokens: 0.00025,
        capabilities: ['reasoning', 'analysis']
      }
    ]
  },
  {
    id: 'google',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    requiresAuth: true,
    authType: 'api-key',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Advanced reasoning and multimodal capabilities',
        contextLength: 2000000,
        costPer1kTokens: 0.00125,
        capabilities: ['reasoning', 'analysis', 'multimodal', 'code']
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast and efficient for most tasks',
        contextLength: 1000000,
        costPer1kTokens: 0.000075,
        capabilities: ['reasoning', 'analysis', 'code']
      }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    requiresAuth: true,
    authType: 'bearer',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        description: 'Cost-effective model with strong reasoning',
        contextLength: 32768,
        costPer1kTokens: 0.00014,
        capabilities: ['reasoning', 'analysis', 'code']
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        description: 'Specialized for code analysis and security',
        contextLength: 16384,
        costPer1kTokens: 0.00014,
        capabilities: ['code', 'security', 'analysis']
      }
    ]
  }
];

export const getProviderById = (id: string): LLMProvider | undefined => {
  return defaultLLMProviders.find(provider => provider.id === id);
};

export const getAllModels = (): Array<{ provider: LLMProvider; model: any }> => {
  return defaultLLMProviders.flatMap(provider =>
    provider.models.map(model => ({ provider, model }))
  );
};