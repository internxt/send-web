import envService from './env.service';

const KLAVIYO_LIST_ID = envService.getVariable('klaviyoListId');
const PUBLIC_KEY = envService.getVariable('klaviyoPublicKey');

export const subscribeToNewsletter = async (email: string) => {
  const url = `https://a.klaviyo.com/client/subscriptions/?company_id=${PUBLIC_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      revision: '2024-02-15',
      'content-type': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'subscription',
        attributes: {
          profile: {
            data: {
              type: 'profile',
              attributes: { email },
            },
          },
        },
        relationships: {
          list: {
            data: {
              type: 'list',
              id: KLAVIYO_LIST_ID,
            },
          },
        },
      },
    }),
  });

  if (response.status === 202) {
    return true;
  }

  const responseData = await response.json();
  throw new Error(responseData.errors?.[0]?.detail || 'Subscription failed');
};
