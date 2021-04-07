import { Theme } from '@material-ui/core';
import { InputProps as InputPropsMaterial } from '@material-ui/core/Input';
import InputBase from '@material-ui/core/InputBase';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import withStyles from '@material-ui/core/styles/withStyles';
import Add from '@ori-ui/icons/lib/Add';
import Minus from '@ori-ui/icons/lib/Minus';
import clsx from 'clsx';
import { forwardRef, useMemo } from 'react';
import BorderedIconButton from '../BorderedIconButton';
import { Classes, ComponentConfig, OriUiBaseComponent } from '../types';
import useCounter, { UseCounterProps } from '../useCounter';

const componentConfig: ComponentConfig = {
  name: 'MuiOriCounter',
};

const styles = (theme: Theme) =>
  ({
    root: {
      display: 'inline-grid',
      gridTemplateColumns: '3rem 3.5rem 3rem',
      gridTemplateRows: '3rem',
      gridColumnGap: `${theme.spacing(1)}px`,
    },
    input: {
      margin: 0,
      padding: 0,
      textAlign: 'center',
    },
    readOnly: {
      cursor: 'default',
    },
    iconButton: {},
  } as const);

export type CounterClassKey = Classes<typeof styles>;

export interface CounterProps
  extends UseCounterProps,
    OriUiBaseComponent<CounterClassKey, HTMLInputElement> {
  /**
   * Is counter disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Is counter value required
   * @default false
   */
  required?: boolean;

  /**
   * Is possible to edit value by typing
   * @default false
   */
  editable?: boolean;

  /**
   * Is counter readOnly
   * @default false
   */
  readOnly?: boolean;
}

export const Counter = forwardRef<HTMLInputElement, CounterProps>(
  (props: CounterProps, ref) => {
    const {
      classes,
      maxValue,
      minValue,
      disabled,
      className,
      editable,
      readOnly,
      required,
    } = props;
    const {
      value,
      onDecrease,
      InputProps,
      onIncrease,
      handleChange,
    } = useCounter(props);

    const InputComponent = useMemo(() => {
      if (editable) return OutlinedInput;
      return InputBase;
    }, [editable]);

    return (
      <div className={clsx(classes!.root, className)}>
        <BorderedIconButton
          type="button"
          size="small"
          disabled={disabled || value <= (minValue ?? Number.NEGATIVE_INFINITY)}
          data-testid="decrease"
          classes={{
            root: classes!.iconButton,
          }}
          onClick={onDecrease}
        >
          <Minus />
        </BorderedIconButton>
        <InputComponent
          inputRef={ref as InputPropsMaterial['inputRef']}
          classes={{
            input: clsx(classes!.input, { [classes!.readOnly!]: readOnly }),
          }}
          readOnly={readOnly}
          required={required}
          value={value}
          disabled={disabled}
          inputProps={{
            'data-testid': 'indicator',
          }}
          onChange={handleChange}
          {...InputProps}
        />
        <BorderedIconButton
          type="button"
          size="small"
          disabled={disabled || value >= (maxValue ?? Number.POSITIVE_INFINITY)}
          data-testid="increase"
          classes={{
            root: classes!.iconButton,
          }}
          onClick={onIncrease}
        >
          <Add />
        </BorderedIconButton>
      </div>
    );
  }
);

export default withStyles(styles, componentConfig)(Counter);
