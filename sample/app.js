// Sample JavaScript file for Regex-LE testing
// Test patterns: /function\s+\w+/g, /['"`]([^'"`]+)['"`]/g, /\b(const|let|var)\s+\w+/g

import { Component } from 'react';
import utils from './utils/helpers';
import { formatDate } from '../lib/date';

// Function definitions
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const processUserData = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};

class UserManager {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  getName() {
    return this.name;
  }
}

// String values
const welcomeMessage = 'Welcome to the application';
const apiUrl = "https://api.example.com/v1";
const template = `Hello, ${name}!`;

// Numbers and identifiers
const MAX_USERS = 1000;
const apiVersion = '2.0.1';
const userIds = [101, 102, 103, 204, 305];

// Regex patterns in strings
const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const phonePattern = /^\+?[\d\s\-\(\)]+$/;

// Object with paths
const config = {
  staticPath: './static',
  assetPath: '/assets/images',
  dataPath: '../data/records.json'
};

// Comments to extract
// TODO: Refactor user authentication
// FIXME: Handle edge case in calculateTotal
// NOTE: This needs optimization

