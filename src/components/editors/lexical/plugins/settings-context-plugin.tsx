/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import * as React from 'react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const DEFAULT_SETTINGS = {
  isDebug: false,
  useSelectionToolbar: false,
} as const;

export type SettingName = keyof typeof DEFAULT_SETTINGS;

export const INITIAL_SETTINGS: Record<SettingName, boolean> = {
  ...DEFAULT_SETTINGS,
};

export type Settings = typeof INITIAL_SETTINGS;

type SettingsContextShape = {
  setOption: (name: SettingName, value: boolean) => void;
  settings: Record<SettingName, boolean>;
};

const Context: React.Context<SettingsContextShape> = createContext({
  setOption: (name: SettingName, value: boolean) => {
    return;
  },
  settings: INITIAL_SETTINGS,
});

export const SettingsContext = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {

  const windowLocation = window.location;
  const searchParams = new URLSearchParams(windowLocation.search);
  const initialSettings: Record<SettingName, boolean> = {
    ...INITIAL_SETTINGS,
  };

  console.log("search params", searchParams);

  searchParams.forEach((value, key) => {

    console.log("key", key);

    if (key in initialSettings) {
      const value = searchParams.get(key) === 'true';
      initialSettings[key as SettingName] = value;
      console.log("key in initial settings", key, initialSettings[key as SettingName]);
    }
  });

  const [settings, setSettings] = useState(initialSettings);

  for (let key in settings) {
    console.log("inital key", key, initialSettings[key as SettingName]);
    console.log("settings key", key, settings[key as SettingName]);
  }

  const setOption = useCallback((setting: SettingName, value: boolean) => {
    setSettings((options) => ({
      ...options,
      [setting]: value,
    }));
    setURLParam(setting, value);
  }, []);

  const contextValue = useMemo(() => {
    return {setOption, settings};
  }, [setOption, settings]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useSettings = (): SettingsContextShape => {
  return useContext(Context);
};

function setURLParam(param: SettingName, value: null | boolean) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  if (value !== DEFAULT_SETTINGS[param]) {
    params.set(param, String(value));
  } else {
    params.delete(param);
  }
  url.search = params.toString();
  window.history.pushState(null, '', url.toString());
}
