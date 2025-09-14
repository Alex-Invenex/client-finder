import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import Navbar from '@/components/Navbar';
import { Search, Globe, Mail, Database, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Find{' '}
              <span className="text-gradient">Quality Leads</span>
            </h2>
            <p className="text-lg text-secondary-600">
              Our comprehensive platform provides all the tools you need to identify,
              analyze, and connect with potential clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Search}
              title="Smart Business Search"
              description="Search millions of businesses by location, category, ratings, and more. Get accurate results powered by real-time data."
              color="primary"
            />

            <FeatureCard
              icon={Globe}
              title="Website Analysis"
              description="Automatically analyze business websites to extract contact information, social media profiles, and key insights."
              color="accent"
            />

            <FeatureCard
              icon={Mail}
              title="Verified Contact Info"
              description="Get verified email addresses, phone numbers, and social media contacts for decision-makers at target businesses."
              color="primary"
            />

            <FeatureCard
              icon={Database}
              title="Data Export"
              description="Export your search results and contact lists to CSV or integrate with your CRM using our powerful API."
              color="secondary"
            />

            <FeatureCard
              icon={Shield}
              title="GDPR Compliant"
              description="All data is collected from public sources and processed in compliance with privacy regulations."
              color="accent"
            />

            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Get instant results with our optimized search engine and parallel processing capabilities."
              color="primary"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Next Clients?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses using Client Finder to grow their customer base.
            Start with our free tier and upgrade as you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200">
              Start Free Trial
            </button>
            <button className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-200 border border-primary-500">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-secondary-900 text-secondary-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Client Finder</h3>
              <p className="text-sm">
                Your trusted partner in finding and connecting with potential clients.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 Client Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}