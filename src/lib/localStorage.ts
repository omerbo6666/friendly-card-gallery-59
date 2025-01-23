import { Client } from '@/types/investment';
import { toast } from "@/components/ui/use-toast";

const CLIENTS_STORAGE_KEY = 'investment-clients';

export const saveClients = (clients: Client[]) => {
  try {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    // Notify other tabs about the change
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error saving clients:', error);
    toast({
      title: "Error",
      description: "Failed to save client data",
      variant: "destructive"
    });
  }
};

export const getClients = (): Client[] => {
  try {
    const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return storedClients ? JSON.parse(storedClients) : [];
  } catch (error) {
    console.error('Error getting clients:', error);
    toast({
      title: "Error",
      description: "Failed to load client data",
      variant: "destructive"
    });
    return [];
  }
};

export const addClient = (client: Client) => {
  try {
    const clients = getClients();
    clients.push(client);
    saveClients(clients);
    toast({
      title: "Success",
      description: "New client added successfully"
    });
    return clients;
  } catch (error) {
    console.error('Error adding client:', error);
    toast({
      title: "Error",
      description: "Failed to add new client",
      variant: "destructive"
    });
    return [];
  }
};

export const searchClients = (searchTerm: string): Client[] => {
  const clients = getClients();
  return clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );
};