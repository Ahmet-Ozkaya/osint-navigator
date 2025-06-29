import { ToolCategory, OSINTTool } from '../types';

export const osintCategories: ToolCategory[] = [
  {
    id: 'favorites',
    name: 'Your Favorites',
    description: 'Quick access to your most-used tools',
    icon: '⭐',
    tools: []
  },
  {
    id: 'threat-intel',
    name: 'Threat Intelligence',
    description: 'Advanced threat analysis and IOC investigation',
    icon: '🛡️',
    tools: [
      {
        id: 'ibm-xforce',
        name: 'IBM X-Force',
        url: 'https://exchange.xforce.ibmcloud.com/search/',
        description: 'Search by application name, IP, URL, vulnerability, hash, domain',
        tags: ['threat-intel', 'vulnerability', 'cve', 'hash', 'ip'],
        category: 'threat-intel',
        status: 'online'
      },
      {
        id: 'threatminer',
        name: 'ThreatMiner',
        url: 'https://www.threatminer.org/host.php?q=',
        description: 'Search for domains, IPs, hashes, email addresses',
        tags: ['threat-intel', 'ip', 'hash', 'email', 'domain'],
        category: 'threat-intel',
        status: 'online'
      },
      {
        id: 'greynoise',
        name: 'GreyNoise',
        url: 'https://viz.greynoise.io/query/',
        description: 'Internet-wide scanning activity and threat intelligence',
        tags: ['threat-intel', 'ip', 'scanning', 'noise'],
        category: 'threat-intel',
        status: 'online'
      },
      {
        id: 'alienvault-otx',
        name: 'AlienVault OTX',
        url: 'https://otx.alienvault.com/indicator/domain/',
        description: 'Open Threat Intelligence Community',
        tags: ['threat-intel', 'ioc', 'community'],
        category: 'threat-intel',
        status: 'online'
      },
      {
        id: 'onyphe',
        name: 'Onyphe',
        url: 'https://www.onyphe.io/search?q=category:datascan+',
        description: 'Data Scan',
        tags: ['threat-intel', 'ip', 'scanning'],
        category: 'threat-intel',
        status: 'online'
      },
      {
        id: 'socradar-th',
        name: 'SOCRadar TH',
        url: 'https://platform.socradar.com/app/threat-hunting?q=',
        description: 'SOC Radar Threat Hunting',
        tags: ['threat-intel', 'hunting'],
        category: 'threat-intel',
        status: 'online'
      },
      {
        id: 'talos-intelligence',
        name: 'Talos Intelligence',
        url: 'https://talosintelligence.com/reputation_center/lookup?search=',
        description: 'Cisco Talos Intelligence',
        tags: ['threat-intel', 'reputation'],
        category: 'threat-intel',
        status: 'online'
      },
      {
        id: 'crowdsec-intel',
        name: 'CrowdSec Intel',
        url: 'https://app.crowdsec.net/cti/',
        description: 'Explore the CrowdSec Threat Intelligence',
        tags: ['threat-intel', 'ip'],
        category: 'threat-intel',
        status: 'online'
      }
    ]
  },
  {
    id: 'ip-analysis',
    name: 'IP & Network Analysis',
    description: 'Comprehensive IP address and network investigation',
    icon: '🌐',
    tools: [
      {
        id: 'abuseipdb',
        name: 'AbuseIPDB',
        url: 'https://www.abuseipdb.com/check/',
        description: 'Check IP address reputation and abuse reports',
        tags: ['ip', 'abuse', 'reputation', 'blacklist'],
        category: 'ip-analysis',
        status: 'online'
      },
      {
        id: 'ipvoid',
        name: 'IPVoid',
        url: 'https://www.ipvoid.com/scan/',
        description: 'IP address information and blacklist check',
        tags: ['ip', 'blacklist', 'reputation'],
        category: 'ip-analysis',
        status: 'online'
      },
      {
        id: 'criminal-ip',
        name: 'Criminal IP',
        url: 'https://www.criminalip.io/asset/report/',
        description: 'OSINT search engine for attack surface assessment',
        tags: ['ip', 'asset', 'attack-surface'],
        category: 'ip-analysis',
        status: 'online'
      },
      {
        id: 'ipinfo',
        name: 'IPinfo.io',
        url: 'https://ipinfo.io/',
        description: 'IP geolocation and network information',
        tags: ['ip', 'geolocation', 'asn'],
        category: 'ip-analysis',
        status: 'online'
      },
      {
        id: 'spur',
        name: 'Spur',
        url: 'https://spur.us/context/',
        description: 'Detect VPNs, Residential proxies, and Bots',
        tags: ['ip', 'proxy', 'vpn', 'bots'],
        category: 'ip-analysis',
        status: 'online'
      },
      {
        id: 'shodan',
        name: 'Shodan',
        url: 'https://www.shodan.io/search?query=',
        description: 'Search Engine for the Internet of Everything',
        tags: ['ip', 'iot', 'ports', 'devices'],
        category: 'ip-analysis',
        status: 'online'
      }
    ]
  },
  {
    id: 'domain-analysis',
    name: 'Search, Domain & DNS Analysis',
    description: 'Domain registration and DNS investigation tools',
    icon: '🌍',
    tools: [
      {
        id: 'whoisxml',
        name: 'WhoisXML API',
        url: 'https://whois.whoisxmlapi.com/lookup?q=',
        description: 'Comprehensive WHOIS and DNS data',
        tags: ['domain', 'whois', 'dns', 'registration'],
        category: 'domain-analysis',
        status: 'online'
      },
      {
        id: 'securitytrails',
        name: 'SecurityTrails',
        url: 'https://securitytrails.com/domain/',
        description: 'Historical DNS data and domain intelligence',
        tags: ['domain', 'dns', 'historical', 'subdomains'],
        category: 'domain-analysis',
        status: 'online'
      },
      {
        id: 'crtsh',
        name: 'crt.sh',
        url: 'https://crt.sh/?q=',
        description: 'Certificate transparency logs search',
        tags: ['certificate', 'ssl', 'transparency', 'subdomains'],
        category: 'domain-analysis',
        status: 'online'
      },
      {
        id: 'dnsdumpster',
        name: 'DNSdumpster',
        url: 'https://dnsdumpster.com/',
        description: 'DNS recon and domain research',
        tags: ['dns', 'recon', 'subdomains'],
        category: 'domain-analysis',
        status: 'online',
        isStandalone: true
      },
      {
        id: 'urlscan',
        name: 'URLScan.io',
        url: 'https://urlscan.io/search/#',
        description: 'Search for domains, IPs, filenames, hashes, ASNs',
        tags: ['url', 'ip', 'live-scan', 'screenshot'],
        category: 'domain-analysis',
        status: 'online'
      }
    ]
  },
  {
    id: 'email-analysis',
    name: 'Email Investigation',
    description: 'Email address verification and analysis',
    icon: '📧',
    tools: [
      {
        id: 'hunter-io',
        name: 'Hunter.io',
        url: 'https://hunter.io/search/',
        description: 'Find and verify email addresses',
        tags: ['email', 'verification', 'company'],
        category: 'email-analysis',
        status: 'online'
      },
      {
        id: 'haveibeenpwned',
        name: 'Have I Been Pwned',
        url: 'https://haveibeenpwned.com/',
        description: 'Check if email was in data breaches',
        tags: ['email', 'breach', 'password'],
        category: 'email-analysis',
        status: 'online',
        isStandalone: true
      },
      {
        id: 'emailrep',
        name: 'EmailRep',
        url: 'https://emailrep.io/',
        description: 'Email reputation and risk assessment',
        tags: ['email', 'reputation', 'risk'],
        category: 'email-analysis',
        status: 'online',
        isStandalone: true
      }
    ]
  },
  {
    id: 'social-media',
    name: 'Social Media & People',
    description: 'Social media investigation and people search',
    icon: '👥',
    tools: [
      {
        id: 'sherlock',
        name: 'Sherlock Project',
        url: 'https://github.com/sherlock-project/sherlock',
        description: 'Hunt down social media accounts by username',
        tags: ['username', 'social-media', 'osint'],
        category: 'social-media',
        status: 'online',
        isStandalone: true
      },
      {
        id: 'namechk',
        name: 'Namechk',
        url: 'https://namechk.com',
        description: 'Check username availability across platforms',
        tags: ['username', 'availability', 'social-media'],
        category: 'social-media',
        status: 'online',
        isStandalone: true
      },
      {
        id: 'pipl',
        name: 'Pipl',
        url: 'https://pipl.com/',
        description: 'People search engine',
        tags: ['people', 'search', 'identity'],
        category: 'social-media',
        status: 'online',
        isStandalone: true
      }
    ]
  },
  {
    id: 'malware-analysis',
    name: 'Malware & File Analysis',
    description: 'File analysis and malware investigation',
    icon: '🦠',
    tools: [
      {
        id: 'virustotal',
        name: 'VirusTotal',
        url: 'https://www.virustotal.com/gui/search/',
        description: 'Analyze suspicious files, domains, IPs & URLs',
        tags: ['ip', 'url', 'hash', 'malware', 'files'],
        category: 'malware-analysis',
        status: 'online'
      },
      {
        id: 'hybrid-analysis',
        name: 'Hybrid Analysis',
        url: 'https://www.hybrid-analysis.com/search?query=',
        description: 'Malware analysis and threat intelligence',
        tags: ['malware', 'sandbox', 'files', 'hash'],
        category: 'malware-analysis',
        status: 'online'
      },
      {
        id: 'joe-sandbox',
        name: 'Joe Sandbox',
        url: 'https://www.joesandbox.com/',
        description: 'Deep malware analysis platform',
        tags: ['malware', 'sandbox', 'analysis'],
        category: 'malware-analysis',
        status: 'online',
        isStandalone: true
      },
      {
        id: 'any-run',
        name: 'ANY.RUN',
        url: 'https://app.any.run/',
        description: 'Interactive online malware analysis',
        tags: ['malware', 'sandbox', 'interactive'],
        category: 'malware-analysis',
        status: 'online',
        isStandalone: true
      }
    ]
  }
];

export const getAllTools = (): OSINTTool[] => {
  return osintCategories.flatMap(category => category.tools);
};

export const getToolsByCategory = (categoryId: string): OSINTTool[] => {
  const category = osintCategories.find(cat => cat.id === categoryId);
  return category ? category.tools : [];
};

export const searchTools = (query: string): OSINTTool[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllTools().filter(tool =>
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getFavoriteTools = (favoriteIds: string[]): OSINTTool[] => {
  const allTools = getAllTools();
  return favoriteIds.map(id => allTools.find(tool => tool.id === id)).filter(Boolean) as OSINTTool[];
};