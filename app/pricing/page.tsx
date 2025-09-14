'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Check, X, Zap, Star, Shield, Headphones } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out Client Finder',
      price: { monthly: 0, yearly: 0 },
      credits: 10,
      features: [
        '10 searches per month',
        'Basic business information',
        'Limited contact info',
        'Email support',
      ],
      notIncluded: [
        'Website analysis',
        'Bulk export',
        'API access',
        'Priority support',
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'secondary' as const,
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Best for small businesses and freelancers',
      price: { monthly: 29, yearly: 290 },
      credits: 100,
      features: [
        '100 searches per month',
        'Full business information',
        'Complete contact details',
        'Website analysis',
        'Export to CSV',
        'Priority email support',
        'Search history',
        'Saved businesses',
      ],
      notIncluded: [
        'API access',
        'Bulk operations',
        'Custom integrations',
        'Phone support',
      ],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'primary' as const,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For growing businesses and agencies',
      price: { monthly: 99, yearly: 990 },
      credits: -1, // Unlimited
      features: [
        'Unlimited searches',
        'Full business intelligence',
        'Advanced contact extraction',
        'Website analysis',
        'Bulk export (CSV, JSON)',
        'API access',
        'Custom integrations',
        'White-label options',
        'Dedicated account manager',
        'Phone & priority support',
      ],
      notIncluded: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'primary' as const,
      popular: false,
    },
  ];

  const getDiscountedPrice = (plan: any) => {
    if (billingCycle === 'yearly') {
      return Math.round(plan.price.yearly / 12);
    }
    return plan.price.monthly;
  };

  const getSavings = (plan: any) => {
    if (billingCycle === 'yearly' && plan.price.monthly > 0) {
      const yearlyMonthly = plan.price.yearly / 12;
      const savings = ((plan.price.monthly - yearlyMonthly) / plan.price.monthly) * 100;
      return Math.round(savings);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Simple, Transparent{' '}
            <span className="text-gradient">Pricing</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            Choose the perfect plan for your business needs. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-secondary-900' : 'text-secondary-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-secondary-900' : 'text-secondary-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Save up to 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                plan.popular
                  ? 'border-primary-500 scale-105'
                  : 'border-secondary-100 hover:border-primary-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
                  <p className="text-secondary-600 mb-6">{plan.description}</p>

                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-secondary-900">
                        ${getDiscountedPrice(plan)}
                      </span>
                      <span className="text-secondary-500">
                        {plan.price.monthly === 0 ? '' : '/month'}
                      </span>
                    </div>

                    {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-secondary-500 line-through">
                          ${plan.price.monthly}/month
                        </span>
                        <span className="ml-2 text-sm text-green-600 font-medium">
                          Save {getSavings(plan)}%
                        </span>
                      </div>
                    )}

                    {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                      <p className="text-sm text-secondary-500 mt-1">
                        Billed annually (${plan.price.yearly}/year)
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      {plan.credits === -1 ? 'Unlimited' : `${plan.credits} credits`} per month
                    </span>
                  </div>

                  <Link
                    href={plan.id === 'enterprise' ? '/contact' : '/auth/register'}
                    className={`w-full btn-${plan.buttonVariant} block text-center`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary-900">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-secondary-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-semibold text-secondary-900 mt-6">Not included:</h4>
                      <ul className="space-y-3">
                        {plan.notIncluded.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <X className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                            <span className="text-secondary-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                What happens when I reach my credit limit?
              </h3>
              <p className="text-secondary-600">
                Once you reach your monthly credit limit, you can either upgrade your plan or wait until the next billing cycle for your credits to reset. We'll notify you when you're approaching your limit.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Can I cancel my subscription at any time?
              </h3>
              <p className="text-secondary-600">
                Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your current billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-secondary-600">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start your free account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-secondary-600">
                We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay by invoice.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-secondary-600">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to find your next clients?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using Client Finder to grow their customer base.
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary bg-white text-primary-600 hover:bg-primary-50">
              Start Free Trial
            </Link>
            <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}