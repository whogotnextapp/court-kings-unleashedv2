
import React from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PremiumUpgradeProps {
  onBack: () => void;
}

const PremiumUpgrade = ({ onBack }: PremiumUpgradeProps) => {
  const features = [
    'Unlimited game joins',
    'Advanced player stats',
    'Priority court booking',
    'Custom badges & achievements',
    'Video highlights upload',
    'Direct messaging with players',
    'Exclusive tournament access'
  ];

  const handleUpgrade = () => {
    // Mock Stripe checkout flow
    console.log('Initiating Stripe checkout...');
    // In real app: window.open(stripeCheckoutUrl, '_blank');
    alert('Premium upgrade coming soon! 🏀');
  };

  return (
    <div className="min-h-screen brand-gradient p-4">
      <div className="max-w-md mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Go Premium</h1>
          <p className="text-white/80">Unlock your full potential on the court</p>
        </div>

        {/* Pricing Card */}
        <Card className="p-6 mb-6 glass-effect border-2 border-white/30">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-2">$9.99<span className="text-lg font-normal">/month</span></div>
            <div className="text-white/80">7-day free trial</div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-white text-brand-magenta font-bold py-3 hover:scale-105 transition-transform"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Free Trial
          </Button>
        </Card>

        {/* Social Proof */}
        <Card className="p-4 glass-effect border border-white/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['MJ', 'KB', 'DW', 'AD'].map((initial, index) => (
                <div key={index} className="w-8 h-8 bg-white text-brand-magenta rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
                  {initial}
                </div>
              ))}
            </div>
            <div className="text-white text-sm">
              <div className="font-semibold">1,247+ players upgraded</div>
              <div className="text-white/70">Join the elite community</div>
            </div>
            <div className="ml-auto">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
        </Card>

        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full border-white/30 text-white hover:bg-white/10"
        >
          Maybe Later
        </Button>

        {/* Fine Print */}
        <p className="text-center text-white/60 text-xs mt-4">
          Cancel anytime. No hidden fees. Terms & conditions apply.
        </p>
      </div>
    </div>
  );
};

export default PremiumUpgrade;
