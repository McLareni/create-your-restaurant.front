import { StaffMember, CreateStaffDTO, UpdateStaffDTO } from '../types/staff.types';
import { nanoid } from 'nanoid';

const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

let mockStaff: StaffMember[] = [
  { id: '1', firstName: 'Олена', lastName: 'Коваленко', email: 'olena@gastro.com', phone: '+380501234567', role: 'MANAGER', isActive: true, avatarColor: 'bg-purple-500' },
  { id: '2', firstName: 'Іван', lastName: 'Петренко', email: 'ivan@gastro.com', phone: '+380671234567', role: 'CHEF', isActive: true, avatarColor: 'bg-orange-500' },
  { id: '3', firstName: 'Марія', lastName: 'Ткач', email: 'maria@gastro.com', phone: '+380631234567', role: 'WAITER', isActive: false, avatarColor: 'bg-green-500' },
];

const getRandomColor = () => avatarColors[Math.floor(Math.random() * avatarColors.length)];

export const staffApi = {
  getAll: async (): Promise<StaffMember[]> => {
    return [...mockStaff];
  },

  create: async (data: CreateStaffDTO): Promise<StaffMember> => {
    const newStaff: StaffMember = {
      id: nanoid(10),
      ...data,
      avatarColor: getRandomColor(),
    };
    mockStaff.push(newStaff);
    return newStaff;
  },

  update: async (id: string, data: UpdateStaffDTO): Promise<StaffMember> => {
    const index = mockStaff.findIndex(s => s.id === id);
    if (index !== -1) {
      mockStaff[index] = { ...mockStaff[index], ...data };
    }
    return mockStaff[index];
  },

  delete: async (id: string): Promise<void> => {
    mockStaff = mockStaff.filter(s => s.id !== id);
  }
};