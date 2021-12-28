/* eslint-disable @typescript-eslint/no-shadow */
/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BackstageTheme } from '@backstage/theme';
import BottomNavigationAction, {
  BottomNavigationActionProps,
} from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarStateContext } from '.';
import { Link } from '../../components';
import { sidebarConfig } from './config';
import { MobileSidebarContext } from './MobileSidebar';

/** @public */
export interface SidebarGroupProps extends BottomNavigationActionProps {
  to?: string;
  priority?: number;
}

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    flexGrow: 0,
    margin: theme.spacing(0, 2),
    color: theme.palette.navigation.color,
  },

  selected: {
    color: `${theme.palette.navigation.selectedColor}!important`,
    borderTop: `solid ${sidebarConfig.selectedIndicatorWidth}px ${theme.palette.navigation.indicator}`,
    marginTop: '-1px',
  },

  label: {
    display: 'none',
  },
}));

const MobileSidebarGroup = (props: SidebarGroupProps) => {
  const { to, label, icon, value } = props;
  const classes = useStyles();
  const location = useLocation();
  const { selectedMenuItemIndex, setSelectedMenuItemIndex } =
    useContext(MobileSidebarContext);

  const onChange = (_: React.ChangeEvent<{}>, value: number) => {
    if (value === selectedMenuItemIndex) {
      setSelectedMenuItemIndex(-1);
    } else {
      setSelectedMenuItemIndex(value);
    }
  };

  const selected =
    (value === selectedMenuItemIndex && selectedMenuItemIndex >= 0) ||
    (!(value === selectedMenuItemIndex) &&
      !(selectedMenuItemIndex >= 0) &&
      to === location.pathname);

  return (
    // Material UI issue: https://github.com/mui-org/material-ui/issues/27820
    // @ts-ignore
    <BottomNavigationAction
      label={label}
      icon={icon}
      component={Link}
      to={to ? to : location.pathname}
      onChange={onChange}
      value={value}
      selected={selected}
      classes={classes}
    />
  );
};

/** @public */
export const SidebarGroup = (
  props: React.PropsWithChildren<SidebarGroupProps>,
) => {
  const { children, to, label, icon, value } = props;
  const { isMobile } = useContext(SidebarStateContext);

  return isMobile ? (
    <MobileSidebarGroup to={to} label={label} icon={icon} value={value} />
  ) : (
    <>{children}</>
  );
};
