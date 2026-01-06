import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, TrendingUp, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-body">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" data-testid="section-hero">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl opacity-60" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-sm font-semibold tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  CRIA Expert
                </motion.div>
                
                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1]" data-testid="text-hero-title">
                  Welcome to My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">Expertise</span>
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg" data-testid="text-hero-description">
                  Navigating the Quebec job market requires more than a resume—it demands a strategy. I provide the essential guidance you need to succeed.
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4 flex-wrap">
                  <Link href="/book">
                    <Button size="lg" className="bg-primary text-white px-8 h-12 text-base shadow-xl shadow-primary/20 transition-all" data-testid="button-hero-book">
                      Book a Consultation
                    </Button>
                  </Link>
                  <Link href="#expertise">
                    <Button variant="outline" size="lg" className="border-2 px-8 h-12 text-base transition-all" data-testid="button-hero-learn">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-card">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" 
                    alt="Audrey Mondesir" 
                    className="w-full h-auto object-cover"
                    data-testid="img-hero"
                  />
                </div>
                {/* Decorative squares */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-xl -z-0" />
                <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/10 rounded-xl -z-0" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Value Proposition / Intro */}
        <section id="expertise" className="py-20 bg-card" data-testid="section-expertise">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-expertise-title">Why Choosing the Right Path Matters</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Many immigrants mistakenly believe that obtaining a Master's degree is the only way to succeed. 
                But the reality is that the job market in Quebec often seeks skilled trades and technicians 
                much more urgently than it needs advanced degrees in Sociology or similar fields.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <ServiceCard 
                title="Strategic Insight" 
                description="This is market analysis at its finest. I help you understand which professions are truly hiring." 
                icon={TrendingUp}
              />
              <ServiceCard 
                title="Credential Recognition" 
                description="I assist you in getting your credentials recognized and avoiding the pitfalls of unnecessary studies." 
                icon={GraduationCap}
                delay={100}
              />
              <ServiceCard 
                title="Employability Strategy" 
                description="Forget the generic advice. We focus on practical skills that lead to employment and financial stability." 
                icon={Briefcase}
                delay={200}
              />
            </div>
          </div>
        </section>

        {/* Personal Statement */}
        <section className="py-20 bg-secondary/5 border-y border-border" data-testid="section-commitment">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" 
                  alt="Industrial Expertise" 
                  className="rounded-2xl shadow-xl grayscale hover:grayscale-0 transition-all duration-500"
                  data-testid="img-commitment"
                />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-commitment-title">My Commitment to You</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  As a CRIA (Expert in Industrial Relations), I understand the nuances of the job market. 
                  My background in construction and manufacturing gives me the insight to guide you effectively.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  With 16 years of experience, I know what employers are looking for. I'm here to break the 
                  belief that "prestige" is the only path. I provide the truth—focusing on practical skills 
                  that lead to employment.
                </p>
                
                <div className="pt-4 p-6 bg-card rounded-xl border-l-4 border-accent shadow-sm">
                  <p className="italic text-foreground font-medium" data-testid="text-quote">
                    "I'll help you focus on getting your skills recognized so you can become a foreman and start earning sooner."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="services" className="py-24 bg-primary text-white text-center relative overflow-hidden" data-testid="section-cta">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-2xl mx-auto space-y-8">
              <Users className="w-16 h-16 mx-auto text-accent mb-4" />
              <h2 className="text-3xl md:text-5xl font-bold text-white" data-testid="text-cta-title">Ready to Strategize?</h2>
              <p className="text-xl text-primary-foreground/80">
                Stop guessing and start planning. Book a one-on-one consultation to analyze your profile and create a roadmap for your career in Quebec.
              </p>
              
              <div className="pt-4">
                <Link href="/book">
                  <Button size="lg" className="bg-accent text-primary font-bold px-10 h-14 text-lg shadow-xl transition-all" data-testid="button-cta-book">
                    Book Consultation - $50
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-primary-foreground/60">
                  Secure payment integration via Stripe
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
