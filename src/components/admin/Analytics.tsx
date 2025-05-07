
import React from 'react';
import DashboardStats from './DashboardStats';
import TopLikedProperties from './TopLikedProperties';

type Property = {
  id: string;
  title: string;
  location: string;
  type: string;
  price: string;
  details: string;
  ref: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  sold: boolean;
  likes: number;
  images?: string[];
};

type AnalyticsProps = {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  totalLikes: number;
  topLikedProperties: Property[];
};

const Analytics = ({
  totalProperties,
  availableProperties,
  soldProperties,
  totalLikes,
  topLikedProperties
}: AnalyticsProps) => {
  return (
    <div className="space-y-8">
      <DashboardStats 
        totalProperties={totalProperties}
        availableProperties={availableProperties}
        soldProperties={soldProperties}
        totalLikes={totalLikes}
      />
      
      <TopLikedProperties properties={topLikedProperties} />
    </div>
  );
};

export default Analytics;
