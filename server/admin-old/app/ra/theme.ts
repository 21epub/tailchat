import { defaultTheme } from 'react-admin';
import type { ThemeOptions } from '@mui/material';

const customRaComponents = {
  RaDatagrid: {
    styleOverrides: {
      root: {
        '& .RaDatagrid-headerCell': {
          whiteSpace: 'nowrap',
        },
      },
    },
  },
};

export const theme: ThemeOptions = {
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    ...customRaComponents,
  },
};
