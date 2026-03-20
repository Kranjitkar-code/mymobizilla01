<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h3 class="text-lg font-semibold mb-2">Total Users</h3>
                            <p class="text-3xl font-bold">{{ $stats['users_count'] }}</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <h3 class="text-lg font-semibold mb-2">Admin Users</h3>
                            <p class="text-3xl font-bold">{{ $stats['admin_count'] }}</p>
                        </div>
                    </div>

                    <div class="mt-8">
                        <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a href="{{ route('admin.users.index') }}" class="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100">
                                <h4 class="font-semibold">Manage Users</h4>
                                <p class="text-sm text-gray-600">View and manage user accounts</p>
                            </a>
                            <a href="#" class="block p-6 bg-green-50 rounded-lg hover:bg-green-100">
                                <h4 class="font-semibold">Content Management</h4>
                                <p class="text-sm text-gray-600">Manage website content</p>
                            </a>
                            <a href="#" class="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <h4 class="font-semibold">Settings</h4>
                                <p class="text-sm text-gray-600">Configure website settings</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
