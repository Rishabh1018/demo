import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { api } from '../utils/api'

export function TestConnection() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<string>('')

  const testConnection = async () => {
    setStatus('testing')
    setResult('')
    
    try {
      const health = await api.healthCheck()
      setResult(`✅ Connection successful: ${JSON.stringify(health)}`)
      setStatus('success')
    } catch (error) {
      setResult(`❌ Connection failed: ${error.message}`)
      setStatus('error')
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={status === 'testing'}
          className="w-full"
        >
          {status === 'testing' ? 'Testing...' : 'Test Backend Connection'}
        </Button>
        
        {status !== 'idle' && (
          <div className="p-3 rounded-lg bg-gray-50">
            <Badge 
              variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}
              className="mb-2"
            >
              {status.toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-700">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}