import { createContext, useContext } from 'react';

import { LayoutConfig } from './layoutConfig';

/** The active layout's config, for deep renderers like timeline entries. */
export const LayoutContext = createContext<LayoutConfig>({});

export const useLayoutConfig = () => useContext(LayoutContext);
