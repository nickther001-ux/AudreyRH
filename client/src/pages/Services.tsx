import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle, ArrowRight, Users, Briefcase, Star, Building2 } from "lucide-react";
import bokehBg from "@assets/IMM_1768534974735.png";

interface PricingCardProps {
  phase: string;
  name: string;
  subtitle: string;
  forWho: string;
  forDetail: string;
  price: string;
  priceNote?: string;
  items: string[];
  note?: string;
  isRequired?: boolean;
  isPopular?: boolean;
  t: (key: string) => string;
}

function PricingCard({ phase, name, subtitle, forWho, forDetail, price, priceNote, items, note, isRequired, isPopular, t }: PricingCardProps) {
  return (
    <Card className={`p-6 card-hover-lift relative ${isPopular ? 'border-accent border-2' : 'border-border'} ${isRequired ? 'bg-primary/5' : 'bg-card'}`}>
      {isRequired && (
        <Badge className="absolute -top-3 left-4 bg-primary text-primary-foreground">
          {t("pricing.required")}
        </Badge>
      )}
      {isPopular && (
        <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground">
          <Star className="w-3 h-3 mr-1" />
          {t("pricing.popular")}
        </Badge>
      )}
      
      <div className="mb-4">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">{phase}</span>
        <h3 className="text-xl font-bold mt-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-medium">{forWho}</span>
        </div>
        <p className="text-xs text-muted-foreground ml-6">{forDetail}</p>
      </div>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-primary">{price}</div>
        {priceNote && (
          <p className="text-xs text-muted-foreground">{priceNote}</p>
        )}
      </div>
      
      <ul className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
      
      {note && (
        <div className="text-xs text-muted-foreground italic bg-muted/50 p-3 rounded-md mb-4">
          {note}
        </div>
      )}
      
      <Link href="/book">
        <Button className="w-full" variant={isRequired ? "default" : "outline"}>
          {t("pricing.cta")}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </Card>
  );
}

export default function Services() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section 
          className="py-20 relative overflow-hidden"
          style={{
            backgroundImage: `url(${bokehBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-primary/90" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-pricing-title">
                {t("pricing.title")}
              </h1>
              <p className="text-lg text-white/80">
                {t("pricing.subtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30" data-testid="section-b2c">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Briefcase className="w-4 h-4" />
                {t("pricing.b2c.title")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t("pricing.b2c.subtitle")}
              </h2>
              <div className="accent-line mt-4" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <PricingCard
                phase="0"
                name={t("pricing.phase0.name")}
                subtitle={t("pricing.phase0.subtitle")}
                forWho={t("pricing.phase0.for")}
                forDetail={t("pricing.phase0.forDetail")}
                price={t("pricing.phase0.price")}
                items={[
                  t("pricing.phase0.item1"),
                  t("pricing.phase0.item2"),
                ]}
                note={t("pricing.phase0.note")}
                isRequired={true}
                t={t}
              />
              
              <PricingCard
                phase="A"
                name={t("pricing.phaseA.name")}
                subtitle={t("pricing.phaseA.subtitle")}
                forWho={t("pricing.phaseA.for")}
                forDetail={t("pricing.phaseA.forDetail")}
                price={t("pricing.phaseA.price")}
                priceNote={t("pricing.phaseA.priceNote")}
                items={[
                  t("pricing.phaseA.item1"),
                  t("pricing.phaseA.item2"),
                  t("pricing.phaseA.item3"),
                ]}
                t={t}
              />
              
              <PricingCard
                phase="B"
                name={t("pricing.phaseB.name")}
                subtitle={t("pricing.phaseB.subtitle")}
                forWho={t("pricing.phaseB.for")}
                forDetail={t("pricing.phaseB.forDetail")}
                price={t("pricing.phaseB.price")}
                items={[
                  t("pricing.phaseB.item1"),
                  t("pricing.phaseB.item2"),
                  t("pricing.phaseB.item3"),
                  t("pricing.phaseB.item4"),
                ]}
                t={t}
              />
              
              <PricingCard
                phase="C"
                name={t("pricing.phaseC.name")}
                subtitle={t("pricing.phaseC.subtitle")}
                forWho={t("pricing.phaseC.for")}
                forDetail={t("pricing.phaseC.forDetail")}
                price={t("pricing.phaseC.price")}
                items={[
                  t("pricing.phaseC.item1"),
                  t("pricing.phaseC.item2"),
                  t("pricing.phaseC.item3"),
                  t("pricing.phaseC.item4"),
                ]}
                isPopular={true}
                t={t}
              />
              
              <PricingCard
                phase="D"
                name={t("pricing.phaseD.name")}
                subtitle={t("pricing.phaseD.subtitle")}
                forWho={t("pricing.phaseD.for")}
                forDetail={t("pricing.phaseD.forDetail")}
                price={t("pricing.phaseD.price")}
                items={[
                  t("pricing.phaseD.item1"),
                  t("pricing.phaseD.item2"),
                  t("pricing.phaseD.item3"),
                ]}
                note={t("pricing.phaseD.note")}
                t={t}
              />
            </div>

            <div className="mt-12 max-w-4xl mx-auto space-y-4">
              <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
                <p>{t("pricing.note1")}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
                <p>{t("pricing.note2")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background" data-testid="section-b2b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Building2 className="w-4 h-4" />
                {t("pricing.b2b.title")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t("pricing.b2b.subtitle")}
              </h2>
              <div className="accent-line mt-4" />
            </div>

            <div className="max-w-lg mx-auto">
              <Card className="p-8 card-hover-lift border-accent/30 bg-gradient-to-br from-card to-accent/5">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">{t("pricing.recruitment.name")}</h3>
                  <p className="text-muted-foreground">{t("pricing.recruitment.subtitle")}</p>
                </div>
                
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="text-4xl font-bold text-accent">{t("pricing.recruitment.price")}</div>
                  <p className="text-sm text-muted-foreground">{t("pricing.recruitment.priceNote")}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("pricing.recruitment.item1")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("pricing.recruitment.item2")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{t("pricing.recruitment.item3")}</span>
                  </li>
                </ul>
                
                <Link href="/book">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white" size="lg">
                    {t("pricing.cta")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
