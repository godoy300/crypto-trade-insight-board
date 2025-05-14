
import React, { useState } from 'react';
import { Goal } from '../types/trade';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

// Sample goals data
const sampleGoalsData: Goal[] = [
  {
    id: '1',
    type: 'daily',
    category: 'income',
    target: 100,
    current: 75,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
  },
  {
    id: '2',
    type: 'weekly',
    category: 'income',
    target: 500,
    current: 320,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
  },
  {
    id: '3',
    type: 'quarterly',
    category: 'bankGrowth',
    target: 30,
    current: 12,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString()
  },
  {
    id: '4',
    type: 'semiannual',
    category: 'bankGrowth',
    target: 50,
    current: 15,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString()
  },
  {
    id: '5',
    type: 'annual',
    category: 'income',
    target: 10000,
    current: 3250,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
  }
];

const GoalsTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(sampleGoalsData);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    type: 'daily',
    category: 'income',
    target: 0,
    current: 0
  });
  
  const handleAddGoal = () => {
    if (!newGoal.target) return;
    
    let endDate = new Date();
    
    switch(newGoal.type) {
      case 'daily':
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'semiannual':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case 'annual':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    const goal: Goal = {
      id: `${Date.now()}`,
      type: newGoal.type || 'daily',
      category: newGoal.category || 'income',
      target: newGoal.target || 0,
      current: newGoal.current || 0,
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString()
    };
    
    setGoals([...goals, goal]);
    setNewGoal({
      type: 'daily',
      category: 'income',
      target: 0,
      current: 0
    });
  };
  
  const getGoalsByType = (type: Goal['type']) => {
    return goals.filter(goal => goal.type === type);
  };
  
  const getCategoryIcon = (category: Goal['category']) => {
    return category === 'income' ? 
      <DollarSign className="h-4 w-4 text-green-500" /> : 
      <TrendingUp className="h-4 w-4 text-blue-500" />;
  };
  
  const formatTargetValue = (goal: Goal) => {
    if (goal.category === 'income') {
      return `$${goal.target.toLocaleString()}`;
    }
    return `${goal.target}%`;
  };
  
  const formatCurrentValue = (goal: Goal) => {
    if (goal.category === 'income') {
      return `$${goal.current.toLocaleString()}`;
    }
    return `${goal.current}%`;
  };
  
  const getPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const percentage = getPercentage(goal.current, goal.target);
    const daysLeft = getDaysLeft(goal.endDate);
    
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getCategoryIcon(goal.category)}
              <CardTitle className="text-lg">
                {goal.category === 'income' ? 'Income' : 'Bank Growth'}
              </CardTitle>
            </div>
            <span className="text-sm text-muted-foreground">
              {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
            </span>
          </div>
          <CardDescription>
            Target: {formatTargetValue(goal)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={percentage} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="font-medium">{formatCurrentValue(goal)}</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Goals Tracker
        </CardTitle>
        <CardDescription>Set and track your trading goals</CardDescription>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new goal</DialogTitle>
              <DialogDescription>
                Set targets for your trading performance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="goalType" className="text-right">
                  Type
                </Label>
                <Select 
                  value={newGoal.type} 
                  onValueChange={(value: any) => setNewGoal({...newGoal, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semiannual">Semi-Annual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="goalCategory" className="text-right">
                  Category
                </Label>
                <Select 
                  value={newGoal.category} 
                  onValueChange={(value: any) => setNewGoal({...newGoal, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select goal category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="bankGrowth">Bank Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target" className="text-right">
                  Target
                </Label>
                <Input
                  id="target"
                  type="number"
                  className="col-span-3"
                  value={newGoal.target || ''}
                  onChange={(e) => setNewGoal({...newGoal, target: parseFloat(e.target.value)})}
                  placeholder={newGoal.category === 'income' ? "Amount in USD" : "Percentage"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current" className="text-right">
                  Current
                </Label>
                <Input
                  id="current"
                  type="number"
                  className="col-span-3"
                  value={newGoal.current || ''}
                  onChange={(e) => setNewGoal({...newGoal, current: parseFloat(e.target.value)})}
                  placeholder={newGoal.category === 'income' ? "Amount in USD" : "Percentage"}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddGoal}>Save Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="semiannual">Semi-Annual</TabsTrigger>
            <TabsTrigger value="annual">Annual</TabsTrigger>
          </TabsList>
          
          {['daily', 'weekly', 'quarterly', 'semiannual', 'annual'].map((period) => (
            <TabsContent key={period} value={period}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getGoalsByType(period as Goal['type']).length > 0 ? (
                  getGoalsByType(period as Goal['type']).map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2 text-center py-8">
                    No {period} goals set. Use the "Add New Goal" button to create one.
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GoalsTracker;
