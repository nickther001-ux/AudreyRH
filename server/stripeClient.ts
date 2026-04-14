import Stripe from 'stripe';

async function getCredentialsFromConnector(): Promise<{ publishableKey: string; secretKey: string } | null> {
  try {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY
      ? 'repl ' + process.env.REPL_IDENTITY
      : process.env.WEB_REPL_RENEWAL
        ? 'depl ' + process.env.WEB_REPL_RENEWAL
        : null;

    if (!hostname || !xReplitToken) return null;

    const connectorName = 'stripe';
    const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
    const targetEnvironment = isProduction ? 'production' : 'development';

    const url = new URL(`https://${hostname}/api/v2/connection`);
    url.searchParams.set('include_secrets', 'true');
    url.searchParams.set('connector_names', connectorName);
    url.searchParams.set('environment', targetEnvironment);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken,
      },
    });

    const data = await response.json();
    const settings = data.items?.[0];

    if (!settings?.settings?.secret) return null;

    return {
      publishableKey: settings.settings.publishable ?? '',
      secretKey: settings.settings.secret,
    };
  } catch {
    return null;
  }
}

async function getCredentials(): Promise<{ publishableKey: string; secretKey: string }> {
  const fromConnector = await getCredentialsFromConnector();
  if (fromConnector) return fromConnector;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (secretKey) {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? '';
    return { secretKey, publishableKey };
  }

  throw new Error('No Stripe credentials found (connector or STRIPE_SECRET_KEY env var)');
}

export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  });
}

export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

export async function getStripeSecretKey() {
  const { secretKey } = await getCredentials();
  return secretKey;
}

let stripeSync: any = null;

export async function getStripeSync() {
  if (!stripeSync) {
    const { StripeSync } = await import('stripe-replit-sync');
    const secretKey = await getStripeSecretKey();

    stripeSync = new StripeSync({
      poolConfig: {
        connectionString: process.env.DATABASE_URL!,
        max: 2,
      },
      stripeSecretKey: secretKey,
    });
  }
  return stripeSync;
}
