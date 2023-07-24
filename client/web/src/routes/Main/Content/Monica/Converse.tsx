import { NotFound } from '@/components/NotFound';
import { ConversePanel } from '@/components/Panel/personal/ConversePanel';
import React from 'react';
import { useParams } from 'react-router';

export const MonicaConverse: React.FC = React.memo(({ converseId }: any) => {
  // const { converseId } = useParams();

  // const params ={
  //   converseId:converseId

  // }
  console.log('[MonicaConverse]', converseId);
  if (!converseId) {
    return <NotFound />;
  }

  return <ConversePanel converseId={converseId} />;
});
MonicaConverse.displayName = 'MonicaConverse';
