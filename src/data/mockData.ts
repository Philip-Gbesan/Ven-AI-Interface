// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  orgName: string;
}

export interface Instance {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  engineEnabled: boolean;
  storageUsed: number; // in bytes
  maxStorage: number; // in bytes (1GB limit)
  fileCount: number;
  chunkCount: number;
  createdAt: string;
  lastActivity: string;
}

export interface FileItem {
  id: string;
  instanceId: string;
  name: string;
  size: number; // in bytes
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'csv' | 'md';
  status: 'uploading' | 'parsing' | 'chunking' | 'embedding' | 'ready' | 'error';
  chunkCount: number;
  uploadedAt: string;
  errorMessage?: string;
}

export interface ChatSource {
  id: string;
  fileId: string;
  fileName: string;
  snippet: string;
  chunkIndex: number;
  relevanceScore: number;
}

export interface ChatMessage {
  id: string;
  instanceId: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  instanceId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Mock Data
export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Chen',
  email: 'alex@acmecorp.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  orgName: 'Acme Corporation',
};

// V4 Requirement: storageUsed must be < 1GB (1073741824 bytes)
export const mockInstances: Instance[] = [
  {
    id: 'inst-1',
    name: 'Legal Documents',
    status: 'active',
    engineEnabled: true,
    storageUsed: 420 * 1024 * 1024, // 420MB
    maxStorage: 1 * 1024 * 1024 * 1024, // 1GB
    fileCount: 156,
    chunkCount: 4892,
    createdAt: '2024-01-15T10:30:00Z',
    lastActivity: '24/01/2026',
  },
  {
    id: 'inst-2',
    name: 'HR Policies',
    status: 'active',
    engineEnabled: true,
    storageUsed: 890 * 1024 * 1024, // 890MB
    maxStorage: 1 * 1024 * 1024 * 1024,
    fileCount: 45,
    chunkCount: 1203,
    createdAt: '2024-01-10T14:20:00Z',
    lastActivity: '23/01/2026',
  },
  {
    id: 'inst-3',
    name: 'Product Documentation',
    status: 'inactive',
    engineEnabled: false,
    storageUsed: 150 * 1024 * 1024, // 150MB
    maxStorage: 1 * 1024 * 1024 * 1024,
    fileCount: 234,
    chunkCount: 7651,
    createdAt: '2024-01-05T08:00:00Z',
    lastActivity: '12/01/2026',
  },
  {
    id: 'inst-4',
    name: 'Research Papers',
    status: 'active',
    engineEnabled: true,
    storageUsed: 600 * 1024 * 1024, // 600MB
    maxStorage: 1 * 1024 * 1024 * 1024,
    fileCount: 89,
    chunkCount: 12453,
    createdAt: '2024-01-02T09:45:00Z',
    lastActivity: '28/01/2026',
  },
];

// Helper to generate massive mock files
const generateMockFiles = (count: number): FileItem[] => {
  const files: FileItem[] = [];
  const types: FileItem['type'][] = ['pdf', 'docx', 'txt', 'csv', 'md'];
  const statuses: FileItem['status'][] = ['ready', 'ready', 'ready', 'ready', 'ready', 'ready', 'ready', 'ready', 'ready', 'error']; // 90% ready

  for (let i = 0; i < count; i++) {
    const instanceIndex = Math.floor(Math.random() * mockInstances.length);
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    files.push({
      id: `file-${i + 100}`,
      instanceId: mockInstances[instanceIndex].id,
      name: `Document_${i + 1}_${new Date().getFullYear()}.${type}`,
      size: Math.floor(Math.random() * 15 * 1024 * 1024) + 1024, // 1KB to 15MB
      type,
      status,
      chunkCount: status === 'ready' ? Math.floor(Math.random() * 100) + 5 : 0,
      uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      errorMessage: status === 'error' ? 'Processing failed due to timeout or corruption.' : undefined
    });
  }
  return files;
};

export const mockFiles: FileItem[] = [
  ...generateMockFiles(60), // Generate 60 extra files
  // Explicit files for demos
  {
    id: 'file-1',
    instanceId: 'inst-1',
    name: 'Contract_Template_2024.pdf',
    size: 2.4 * 1024 * 1024,
    type: 'pdf',
    status: 'ready',
    chunkCount: 142,
    uploadedAt: '2024-01-15T10:35:00Z',
  },
  {
    id: 'file-2',
    instanceId: 'inst-1',
    name: 'NDA_Standard.docx',
    size: 856 * 1024,
    type: 'docx',
    status: 'ready',
    chunkCount: 28,
    uploadedAt: '2024-01-16T11:20:00Z',
  },
  {
    id: 'file-7',
    instanceId: 'inst-1',
    name: 'Failed_Import.pdf',
    size: 5.2 * 1024 * 1024,
    type: 'pdf',
    status: 'error',
    chunkCount: 0,
    uploadedAt: '2024-01-27T16:00:00Z',
    errorMessage: 'File exceeds maximum page limit (500 pages)',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    instanceId: 'inst-1',
    title: 'Contract termination clauses',
    createdAt: '2024-01-28T08:30:00Z',
    updatedAt: '2024-01-28T09:15:00Z',
    messages: [
      {
        id: 'msg-1',
        instanceId: 'inst-1',
        role: 'user',
        content: 'What are the standard termination clauses in our contracts?',
        timestamp: '2024-01-28T08:30:00Z',
      },
      {
        id: 'msg-2',
        instanceId: 'inst-1',
        role: 'assistant',
        content: `Based on your uploaded documents, the standard termination clauses include:

1. **Termination for Convenience**: Either party may terminate with 30 days written notice [Source 1].

2. **Termination for Cause**: Immediate termination upon material breach that remains uncured for 15 business days after written notice [Source 2].

3. **Automatic Termination**: The agreement terminates automatically upon bankruptcy, insolvency, or assignment for benefit of creditors [Source 1].

4. **Effect of Termination**: Upon termination, all licenses granted hereunder shall immediately terminate, and each party shall return or destroy confidential information [Source 3].`,
        sources: [
          {
            id: 'src-1',
            fileId: 'file-1',
            fileName: 'Contract_Template_2024.pdf',
            snippet: 'Section 8.1 - Termination for Convenience: Either party may terminate this Agreement at any time, for any reason or no reason, upon thirty (30) days prior written notice to the other party. Such termination shall not relieve either party of obligations accrued prior to the effective date of termination.',
            chunkIndex: 45,
            relevanceScore: 0.94,
          },
          {
            id: 'src-2',
            fileId: 'file-1',
            fileName: 'Contract_Template_2024.pdf',
            snippet: 'Section 8.2 - Termination for Cause: Either party may terminate this Agreement immediately upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within fifteen (15) business days after receiving written notice thereof.',
            chunkIndex: 46,
            relevanceScore: 0.91,
          },
          {
            id: 'src-3',
            fileId: 'file-2',
            fileName: 'NDA_Standard.docx',
            snippet: 'Section 5 - Effect of Termination: Upon termination or expiration of this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information in its possession, including all copies, extracts, and summaries thereof, and shall certify such destruction in writing.',
            chunkIndex: 12,
            relevanceScore: 0.87,
          },
        ],
        timestamp: '2024-01-28T08:30:15Z',
      },
      {
        id: 'msg-3',
        instanceId: 'inst-1',
        role: 'user',
        content: 'What happens to intellectual property upon termination?',
        timestamp: '2024-01-28T09:00:00Z',
      },
      {
        id: 'msg-4',
        instanceId: 'inst-1',
        role: 'assistant',
        content: `According to your contract documents, intellectual property rights upon termination are handled as follows:

1. **Pre-existing IP**: All pre-existing intellectual property remains with the original owner and no license survives termination [Source 1].

2. **Work Product**: Any work product created during the engagement period that was fully paid for transfers to the Client upon termination [Source 2].

3. **License Termination**: All licenses granted under the agreement terminate immediately upon agreement termination [Source 1].`,
        sources: [
          {
            id: 'src-4',
            fileId: 'file-1',
            fileName: 'Contract_Template_2024.pdf',
            snippet: 'Section 9.3 - Intellectual Property Upon Termination: Upon termination, all licenses granted hereunder shall immediately terminate. Each party retains all rights to its pre-existing intellectual property, and no implied licenses are granted by virtue of this Agreement.',
            chunkIndex: 52,
            relevanceScore: 0.96,
          },
          {
            id: 'src-5',
            fileId: 'file-1',
            fileName: 'Contract_Template_2024.pdf',
            snippet: 'Section 9.4 - Work Product: All work product created by Service Provider during the term of this Agreement that has been fully paid for by Client shall be deemed "work made for hire" and shall be owned exclusively by Client upon termination.',
            chunkIndex: 53,
            relevanceScore: 0.89,
          },
        ],
        timestamp: '2024-01-28T09:00:20Z',
      },
    ],
  },
  {
    id: 'conv-2',
    instanceId: 'inst-1',
    title: 'NDA requirements',
    createdAt: '2024-01-27T14:00:00Z',
    updatedAt: '2024-01-27T14:30:00Z',
    messages: [
      {
        id: 'msg-5',
        instanceId: 'inst-1',
        role: 'user',
        content: 'What is the standard NDA duration?',
        timestamp: '2024-01-27T14:00:00Z',
      },
      {
        id: 'msg-6',
        instanceId: 'inst-1',
        role: 'assistant',
        content: `The standard NDA duration in your documents is **3 years** from the date of disclosure [Source 1]. However, for trade secrets, the confidentiality obligation continues indefinitely or until the information no longer qualifies as a trade secret [Source 1].`,
        sources: [
          {
            id: 'src-6',
            fileId: 'file-2',
            fileName: 'NDA_Standard.docx',
            snippet: 'Section 3.1 - Duration of Obligations: The Receiving Party\'s obligations under this Agreement shall continue for a period of three (3) years from the date of disclosure of the Confidential Information. Notwithstanding the foregoing, with respect to trade secrets, the obligations shall continue for as long as such information remains a trade secret under applicable law.',
            chunkIndex: 8,
            relevanceScore: 0.98,
          },
        ],
        timestamp: '2024-01-27T14:00:12Z',
      },
    ],
  },
];

// Utility functions
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStoragePercentage(used: number, max: number): number {
  return Math.round((used / max) * 100);
}

export function getFilesByInstance(instanceId: string): FileItem[] {
  return mockFiles.filter((f) => f.instanceId === instanceId);
}

export function getConversationsByInstance(instanceId: string): Conversation[] {
  return mockConversations.filter((c) => c.instanceId === instanceId);
}

export function getInstanceById(id: string): Instance | undefined {
  return mockInstances.find((i) => i.id === id);
}

export function getFileTypeIcon(type: FileItem['type']): string {
  const icons: Record<FileItem['type'], string> = {
    pdf: 'FileText',
    doc: 'FileText',
    docx: 'FileText',
    txt: 'FileCode',
    csv: 'Table',
    md: 'FileCode',
  };
  return icons[type];
}

export function getStatusColor(status: FileItem['status']): string {
  const colors: Record<FileItem['status'], string> = {
    uploading: 'text-blue-400',
    parsing: 'text-yellow-400',
    chunking: 'text-orange-400',
    embedding: 'text-purple-400',
    ready: 'text-green-400',
    error: 'text-red-400',
  };
  return colors[status];
}
