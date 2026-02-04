import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '../components/ui/Toast';

interface UploadQueueState {
  isUploading: boolean;
  progress: number; // 0-100
  currentIndex: number;
  queueSize: number;
  currentFilename: string | null; // The file currently being "processed" (bar showing)
  recentUpload: string | null;    // The file just finished (text showing)
}

export function useUploadQueue() {
  // 1. All hooks must be at top level
  const [state, setState] = useState<UploadQueueState>({
    isUploading: false,
    progress: 0,
    currentIndex: 0,
    queueSize: 0,
    currentFilename: null,
    recentUpload: null,
  });
  
  const [queue, setQueue] = useState<File[]>([]);
  const callbacks = useRef<{ onFile: ((f: File) => void) | undefined, onAll: (() => void) | undefined }>({ onFile: undefined, onAll: undefined });
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'waiting'>('idle');

  const { addToast } = useToast();
  const mounted = useRef(true);

  // Lifecycle check
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // PHASE 1: Uploading (Progress Simulation)
  useEffect(() => {
    // Only run if we are in 'uploading' state and have a valid file
    if (uploadStatus !== 'uploading' || !queue[state.currentIndex]) return;

    const file = queue[state.currentIndex];
    
    // Sync UI state to "Uploading"
    setState(prev => ({ 
        ...prev, 
        currentFilename: file.name, 
        recentUpload: null, 
        progress: 0, 
        isUploading: true 
    }));

    // Start Simulation Interval
    // Goal: 0->100 in 3000ms.
    // Tick: 100ms. Steps: 30. Increment: 100/30 = 3.333
    const interval = setInterval(() => {
        if (!mounted.current) return;
        
        setState(prev => {
            const next = prev.progress + (100 / 30);
            if (next >= 100) {
                // Done with this file's progress
                clearInterval(interval);
                setUploadStatus('waiting'); // Move to Phase 2
                return { ...prev, progress: 100 };
            }
            return { ...prev, progress: next };
        });
    }, 100);

    return () => clearInterval(interval);
  }, [uploadStatus, state.currentIndex, queue]);

  // PHASE 2: Waiting (Success Text -> delay -> Next)
  useEffect(() => {
    if (uploadStatus !== 'waiting' || !queue[state.currentIndex]) return;

    const file = queue[state.currentIndex];

    // Show Success UI
    setState(prev => ({ ...prev, currentFilename: null, recentUpload: file.name }));
    
    // Fire Callback & Toast
    if (callbacks.current.onFile) callbacks.current.onFile(file);
    addToast({ type: 'success', title: 'Uploaded', message: `${file.name} uploaded successfully.` });

    // Wait 2s before moving to next
    const timer = setTimeout(() => {
        if (!mounted.current) return;

        if (state.currentIndex + 1 < state.queueSize) {
            // Move to Next File
            setState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1, progress: 0 }));
            setUploadStatus('uploading'); // Back to Phase 1
        } else {
            // All Done
            setState(prev => ({ 
                ...prev, 
                isUploading: false, 
                currentFilename: null, 
                recentUpload: null, 
                queueSize: 0, 
                currentIndex: 0 
            }));
            setUploadStatus('idle');
            if (callbacks.current.onAll) callbacks.current.onAll();
        }
    }, 2000);

    return () => clearTimeout(timer);
  }, [uploadStatus, state.currentIndex, state.queueSize, queue, addToast]);

  // Public Trigger
  const uploadFiles = useCallback((files: File[], onFileComplete?: (file: File) => void, onAllComplete?: () => void) => {
    if (files.length === 0) return;
    
    setQueue(files);
    callbacks.current = { onFile: onFileComplete, onAll: onAllComplete };
    
    // Init State
    setState(prev => ({ 
        ...prev, 
        isUploading: true, 
        queueSize: files.length, 
        currentIndex: 0,
        progress: 0,
        currentFilename: null,
        recentUpload: null
    }));
    setUploadStatus('uploading'); // Start Phase 1
  }, []);

  // Derived label
  const progressLabel = state.isUploading 
      ? `Uploading ${state.currentIndex + 1}/${state.queueSize} (${Math.round(state.progress)}%)` 
      : '';

  return {
    ...state,
    progressLabel,
    uploadFiles
  };
}
