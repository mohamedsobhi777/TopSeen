import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for now - replace with actual database
let rulesStorage: { [userId: string]: any[] } = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';
    
    const rules = rulesStorage[userId] || [];
    
    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, userId = 'default-user' } = await request.json();
    
    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }
    
    const newRule = {
      id: uuidv4(),
      userId,
      name,
      description,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (!rulesStorage[userId]) {
      rulesStorage[userId] = [];
    }
    
    rulesStorage[userId].push(newRule);
    
    return NextResponse.json({ rule: newRule }, { status: 201 });
  } catch (error) {
    console.error('Error creating rule:', error);
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, isActive, userId = 'default-user' } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }
    
    const userRules = rulesStorage[userId] || [];
    const ruleIndex = userRules.findIndex(rule => rule.id === id);
    
    if (ruleIndex === -1) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    
    const updatedRule = {
      ...userRules[ruleIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(typeof isActive === 'boolean' && { isActive }),
      updatedAt: new Date().toISOString(),
    };
    
    rulesStorage[userId][ruleIndex] = updatedRule;
    
    return NextResponse.json({ rule: updatedRule });
  } catch (error) {
    console.error('Error updating rule:', error);
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId') || 'default-user';
    
    if (!id) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }
    
    const userRules = rulesStorage[userId] || [];
    const ruleIndex = userRules.findIndex(rule => rule.id === id);
    
    if (ruleIndex === -1) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    
    rulesStorage[userId].splice(ruleIndex, 1);
    
    return NextResponse.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting rule:', error);
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
  }
} 