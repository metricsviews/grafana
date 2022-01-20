import React, { HTMLAttributes } from 'react';
import { css, cx } from '@emotion/css';
import { LinkButton, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';

export interface Props extends HTMLAttributes<HTMLOrSVGElement> {
  text: string;
}

export const UpgradeBox = ({ text, className, ...htmlProps }: Props) => {
  const styles = useStyles2(getUpgradeBoxStyles);

  return (
    <div className={cx(styles.box, className)} {...htmlProps}>
      <h6>You’ve found a Pro feature!</h6>
      <p className={styles.text}>{text}</p>
      <LinkButton
        variant="primary"
        size={'sm'}
        className={styles.button}
        href="https://grafana.com/profile/org/subscription"
        target="__blank"
        rel="noopener noreferrer"
      >
        Upgrade to Pro
      </LinkButton>
    </div>
  );
};

const getUpgradeBoxStyles = (theme: GrafanaTheme2) => {
  const borderRadius = theme.shape.borderRadius(2);

  return {
    box: css`
      position: relative;
      border-radius: ${borderRadius};
      background: ${theme.colors.primary.transparent};
      border: 1px solid ${theme.colors.primary.shade};
      padding: ${theme.spacing(2)};
      color: ${theme.colors.primary.text};
      font-size: ${theme.typography.bodySmall.fontSize};
      text-align: left;
      line-height: 16px;
    `,
    text: css`
      margin-bottom: 0;
    `,
    button: css`
      margin-top: ${theme.spacing(2)};
    `,
  };
};
