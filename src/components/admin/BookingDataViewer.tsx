import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { bookingDataAPI } from '@/api/bookingData';
import { Download, BarChart3, Users, Wrench, RefreshCw } from 'lucide-react';

interface BookingData {
  ID: string;
  'Service Type': string;
  'Device Category': string;
  Brand: string;
  Model: string;
  'Issue/Condition': string;
  'Customer Name': string;
  'Customer Email': string;
  'Customer Phone': string;
  'Quote Value': string;
  Description: string;
  'Submission Time': string;
}

interface BookingStats {
  total_bookings: number;
  repair_bookings: number;
  buyback_bookings: number;
}

export default function BookingDataViewer() {
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    total_bookings: 0,
    repair_bookings: 0,
    buyback_bookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch booking data
      const dataResponse = await bookingDataAPI.getBookingData();
      
      if (dataResponse.success && dataResponse.data) {
        setBookingData(dataResponse.data);
      } else {
        toast({
          title: 'Error',
          description: dataResponse.message || 'Failed to load booking data'
        });
      }
      
      // Fetch booking stats
      const statsResponse = await bookingDataAPI.getBookingStats();
      
      if (statsResponse.success && statsResponse.stats) {
        setStats(statsResponse.stats);
      } else {
        toast({
          title: 'Error',
          description: statsResponse.message || 'Failed to load booking statistics'
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      const blob = await bookingDataAPI.exportBookingData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Export Successful',
        description: 'Booking data exported to CSV'
      });
    } catch (error) {
      console.error('Error exporting booking data:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export booking data'
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Booking Data</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Repair Bookings</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Buyback Bookings</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Loading booking data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Data</h2>
        <div className="flex space-x-2">
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportToCSV} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export to CSV'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total_bookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Repair Bookings</p>
                <p className="text-2xl font-bold">{stats.repair_bookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Buyback Bookings</p>
                <p className="text-2xl font-bold">{stats.buyback_bookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Booking Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {bookingData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No booking data available. When users submit repair or buyback requests, they will appear here.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Quote</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingData.map((booking, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{booking.ID}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking['Service Type'].toLowerCase() === 'repair' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {booking['Service Type']}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.Brand} {booking.Model}</div>
                        <div className="text-sm text-gray-500">{booking['Device Category']}</div>
                      </TableCell>
                      <TableCell>{booking['Customer Name']}</TableCell>
                      <TableCell>
                        <div>{booking['Customer Phone']}</div>
                        <div className="text-sm text-gray-500">{booking['Customer Email']}</div>
                      </TableCell>
                      <TableCell>
                        {booking['Quote Value'] ? (
                          <span className="font-medium text-green-600">
                            {booking['Quote Value']}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(booking['Submission Time']).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">How to use this data</h3>
        <p className="text-sm text-blue-700">
          Click "Export to CSV" to download all booking data as a spreadsheet. 
          The CSV file can be opened in Excel or Google Sheets for further analysis. 
          Each row represents a user submission through the repair or buyback forms.
        </p>
      </div>
    </div>
  );
}