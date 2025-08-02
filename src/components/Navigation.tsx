import { useSearchParams } from 'react-router-dom';
import { Tabs } from '@mantine/core';

export const LeftNavigation = () => {
  const [search, setSearch] = useSearchParams();

  return (
    <Tabs
      value={search.get('tab') || 'simulations'}
      onChange={(value) => {
        if(!value) return;
        setSearch({ tab: value });
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="simulations">Simulations</Tabs.Tab>
        <Tabs.Tab value="about">About</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};
