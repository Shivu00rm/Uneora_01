import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function SupabaseTest() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('testing');
      
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        setStatus('error');
        setMessage(`Connection failed: ${error.message}`);
      } else {
        setStatus('success');
        setMessage('Supabase connection successful');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(`Connection error: ${err.message || 'Unknown error'}`);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'testing':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <Card className={`w-full max-w-md ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Supabase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{message}</p>
        {status === 'error' && (
          <button
            onClick={testConnection}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </CardContent>
    </Card>
  );
}
