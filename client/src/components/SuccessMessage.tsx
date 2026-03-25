import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onReset: () => void;
}

export function SuccessMessage({ onReset }: SuccessMessageProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-12 px-8"
      data-testid="contact-success"
    >
      {/* Animated ring + check */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, type: "spring", stiffness: 220, damping: 18 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.35, type: "spring", stiffness: 300, damping: 20 }}
          >
            <CheckCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </motion.div>
        </div>
        {/* Ripple ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-2xl font-bold text-foreground mb-3"
      >
        {t("contact.success.title")}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-muted-foreground leading-relaxed max-w-sm mb-10"
      >
        {t("contact.success.message")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 w-full justify-center"
      >
        <Button
          variant="outline"
          onClick={onReset}
          data-testid="button-contact-new"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t("contact.success.newRequest")}
        </Button>
        <a href="/" data-testid="link-contact-home">
          <Button className="bg-primary text-white gap-2 w-full sm:w-auto">
            {t("book.success.back")}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </motion.div>
    </motion.div>
  );
}
