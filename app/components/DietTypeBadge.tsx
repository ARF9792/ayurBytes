'use client';

import { Leaf, Drumstick, Egg } from 'lucide-react';
import { useTranslation } from '@/src/contexts/TranslationContext';
import { DietType } from '@/src/types';

interface DietTypeBadgeProps {
  dietType?: DietType;
  size?: 'sm' | 'md' | 'lg';
}

export default function DietTypeBadge({ dietType = 'Vegetarian', size = 'sm' }: DietTypeBadgeProps) {
  const { t } = useTranslation();
  
  const configs = {
    'Vegetarian': {
      icon: Leaf,
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-300',
      label: t('diet.vegetarian')
    },
    'Non-Vegetarian': {
      icon: Drumstick,
      color: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-300',
      label: t('diet.nonVegetarian')
    },
    'Vegan': {
      icon: Leaf,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      border: 'border-emerald-300',
      label: t('diet.vegan')
    },
    'Eggetarian': {
      icon: Egg,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
      label: t('diet.eggetarian')
    }
  };
  
  const config = configs[dietType];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} ${config.bg} ${config.color} ${config.border} border rounded-full font-medium`}>
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
}
