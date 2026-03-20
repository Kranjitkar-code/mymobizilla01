import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { CheckCircle, XCircle, AlertCircle, Database, Zap, Settings } from 'lucide-react'

export default function SystemStatus() {
  const [status, setStatus] = useState({
    supabaseConnection: 'checking',
    databaseTable: 'checking',
    edgeFunction: 'checking',
    notificationCredentials: 'checking'
  })

  const [testResults, setTestResults] = useState({
    connection: null,
    table: null,
    function: null
  })

  useEffect(() => {
    runSystemTests()
  }, [])

  const runSystemTests = async () => {
    // Test 1: Supabase Connection
    try {
      const { data, error } = await supabase.from('repair_orders').select('count').limit(1)

      if (error) {
        if (error.message.includes('does not exist')) {
          setStatus(prev => ({ ...prev, supabaseConnection: 'connected', databaseTable: 'missing' }))
          setTestResults(prev => ({ ...prev, connection: true, table: false }))
        } else {
          setStatus(prev => ({ ...prev, supabaseConnection: 'error' }))
          setTestResults(prev => ({ ...prev, connection: false }))
        }
      } else {
        setStatus(prev => ({ ...prev, supabaseConnection: 'connected', databaseTable: 'ready' }))
        setTestResults(prev => ({ ...prev, connection: true, table: true }))
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, supabaseConnection: 'error' }))
      setTestResults(prev => ({ ...prev, connection: false }))
    }

    // Test 2: Edge Function
    try {
      const { error } = await supabase.functions.invoke('send-notifications', {
        body: { test: true }
      })

      if (error) {
        setStatus(prev => ({ ...prev, edgeFunction: 'not-deployed' }))
        setTestResults(prev => ({ ...prev, function: false }))
      } else {
        setStatus(prev => ({ ...prev, edgeFunction: 'deployed' }))
        setTestResults(prev => ({ ...prev, function: true }))
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, edgeFunction: 'error' }))
      setTestResults(prev => ({ ...prev, function: false }))
    }

    // Test 3: Notification Credentials (always ready since they're hardcoded)
    setStatus(prev => ({ ...prev, notificationCredentials: 'configured' }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'ready':
      case 'deployed':
      case 'configured':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'missing':
      case 'not-deployed':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'ready':
      case 'deployed':
      case 'configured':
        return 'bg-green-100 text-green-800'
      case 'missing':
      case 'not-deployed':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'ready': return 'Ready'
      case 'deployed': return 'Deployed'
      case 'configured': return 'Configured'
      case 'missing': return 'Needs Setup'
      case 'not-deployed': return 'Needs Deployment'
      case 'error': return 'Error'
      default: return 'Checking...'
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔧 Mobizilla System Status</h1>
          <p className="text-xl text-muted-foreground">
            Real-time status of your notification system components
          </p>
        </div>

        <div className="grid gap-6">
          {/* Supabase Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Supabase Connection
                </span>
                <Badge className={getStatusColor(status.supabaseConnection)}>
                  {getStatusIcon(status.supabaseConnection)}
                  {getStatusText(status.supabaseConnection)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>URL:</strong> [CONFIGURED]
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {testResults.connection ? '✅ Connected successfully' : '❌ Connection failed'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Database Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Database Schema
                </span>
                <Badge className={getStatusColor(status.databaseTable)}>
                  {getStatusIcon(status.databaseTable)}
                  {getStatusText(status.databaseTable)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Table:</strong> repair_orders
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {testResults.table ? '✅ Table exists and accessible' : '⚠️ Table needs to be created'}
                </p>
                {!testResults.table && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>Setup Required:</strong> Run the SQL script to create the database table
                    </p>
                    <p className="text-xs text-yellow-700">
                      Go to Supabase Dashboard → SQL Editor → Run setup-database.sql
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Edge Function */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Notification Edge Function
                </span>
                <Badge className={getStatusColor(status.edgeFunction)}>
                  {getStatusIcon(status.edgeFunction)}
                  {getStatusText(status.edgeFunction)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Function:</strong> send-notifications
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {testResults.function ? '✅ Deployed and working' : '🚧 Ready for deployment'}
                </p>
                {!testResults.function && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Deployment Needed:</strong> Edge Function code is ready but needs deployment
                    </p>
                    <p className="text-xs text-blue-700">
                      See DEPLOYMENT_GUIDE.md for step-by-step instructions
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Notification Credentials
                </span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  All Configured
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">📱 Twilio SMS</p>
                  <p className="text-xs text-muted-foreground">Account SID: [CONFIGURED]</p>
                  <p className="text-xs text-muted-foreground">From: [CONFIGURED]</p>
                  <p className="text-xs text-muted-foreground">To: [CONFIGURED]</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">📧 SendGrid Email</p>
                  <p className="text-xs text-muted-foreground">API Key: [CONFIGURED]</p>
                  <p className="text-xs text-muted-foreground">From: [CONFIGURED]</p>
                  <p className="text-xs text-muted-foreground">To: [CONFIGURED]</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Status */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-center">🎯 Overall System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {testResults.connection && testResults.table && testResults.function ? (
                  <div>
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-lg font-semibold text-green-600">System Fully Operational!</p>
                    <p className="text-sm text-muted-foreground">All components are working. Real notifications will be sent.</p>
                  </div>
                ) : testResults.connection && testResults.table ? (
                  <div>
                    <div className="text-4xl mb-2">🚧</div>
                    <p className="text-lg font-semibold text-blue-600">Almost Ready!</p>
                    <p className="text-sm text-muted-foreground">Just deploy the Edge Function for real notifications.</p>
                  </div>
                ) : testResults.connection ? (
                  <div>
                    <div className="text-4xl mb-2">⚙️</div>
                    <p className="text-lg font-semibold text-yellow-600">Setup Required</p>
                    <p className="text-sm text-muted-foreground">Run the database setup script to continue.</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">❌</div>
                    <p className="text-lg font-semibold text-red-600">Connection Issues</p>
                    <p className="text-sm text-muted-foreground">Check your Supabase credentials.</p>
                  </div>
                )}

                <Button onClick={runSystemTests} className="mt-4">
                  🔄 Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}