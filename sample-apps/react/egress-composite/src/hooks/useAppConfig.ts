import { useMemo } from 'react';
import { decode } from 'js-base64';
import { DEFAULT_LAYOUT_ID, LayoutId, SpotlightMode } from '../layouts';

export type AppConfig = {
  baseURL?: string;
  apiKey: string;
  token: string;
  userId: string;
  callId: string;
  callType: string;
  spotlightMode: SpotlightMode;
  layout: LayoutId;
};

export const useAppConfig = () => {
  const query = window.location.search;
  return useMemo<AppConfig>(() => {
    const urlParams = new URLSearchParams(query);
    const apiKey = urlParams.get('api_key') || 'w6yaq5388uym';
    const token =
      urlParams.get('token') ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzYyMzkwMjIsImV4cCI6MTY4NjIzOTAyMiwidXNlcl9pZCI6ImVncmVzcyJ9.s4qy-welN1gJp13EKOyIO5wFo-ZNg2JfWMLnNpzwlwY';
    const payload = JSON.parse(decode(token.split('.')[1]));
    const spotlightMode =
      (urlParams.get('spotlight_mode') as SpotlightMode) || DEFAULT_LAYOUT_ID;
    const layout = (urlParams.get('layout') as LayoutId) || DEFAULT_LAYOUT_ID;

    return {
      apiKey: apiKey,
      token: token,
      callId: urlParams.get('call_id')! || 'egress-test',
      callType: urlParams.get('call_type')! || 'default',
      userId: payload!['user_id'] || urlParams.get('user_id') || 'egress',
      baseURL: urlParams.get('base_url')!,
      spotlightMode: spotlightMode,
      layout: layout,
    };
  }, [query]);
};
