// Sample TypeScript file for Regex-LE testing
// Test patterns: /interface\s+\w+/g, /type\s+\w+/g, /class\s+\w+/g

import { Router } from 'express';
import type { User, Config } from './types';

// Interfaces
interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Types
type Status = 'active' | 'inactive' | 'pending';
type UserRole = 'admin' | 'user' | 'guest';

// Classes
class DatabaseConnection {
  private connectionString: string;
  
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }
  
  connect(): Promise<void> {
    return Promise.resolve();
  }
}

abstract class BaseService {
  abstract process(): void;
}

// Enums
enum Color {
  Red = '#FF0000',
  Green = '#00FF00',
  Blue = '#0000FF'
}

// Generics
function identity<T>(arg: T): T {
  return arg;
}

const numbers: number[] = [1, 2, 3, 4, 5];
const users: User[] = [];

// Template literals
const message = `User ${users.length} connected`;
const path = `/api/v1/users/${userId}`;

// Imports to extract
// Pattern: /import\s+.*?\s+from\s+['"](.+?)['"]/g
import fs from 'fs';
import { EventEmitter } from 'events';
import * as utils from './utils';

