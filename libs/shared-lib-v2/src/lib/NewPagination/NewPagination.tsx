import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'next-i18next';

export interface NewPaginationProps {
  count: number;
  page: number;
  onPageChange: (value: number) => void;
  color?: 'primary' | 'secondary' | 'standard';
  fetchMoreData?: () => void;
  TotalCount: number;
  hasMore?: boolean;
  items?: React.ReactNode[]; // Items to display in infinite scroll
  /** Show the "Go to page" input + Go button beside the page numbers. Default true. */
  showGoToPage?: boolean;
}

const NewPagination: React.FC<NewPaginationProps> = ({
  count,
  page,
  onPageChange,
  color = 'primary',
  fetchMoreData,
  hasMore = true,
  TotalCount = 0,
  items = [],
  showGoToPage = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const [goToValue, setGoToValue] = useState('');

  // Validated on every keystroke, so the error shows and Go stays disabled
  // before the user ever clicks.
  const targetPage = Number(goToValue);
  const isEmpty = goToValue === '';
  const isOutOfRange = !isEmpty && (targetPage < 1 || targetPage > count);
  const canGo = !isEmpty && !isOutOfRange;

  const rangeMessage = `${t('COMMON.ENTER_PAGE_BETWEEN', {
    defaultValue: 'Enter a page between',
  })} 1 - ${count}`;

  // Digits only, so the field can never hold a value we can't parse.
  const handleGoToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoToValue(event.target.value.replace(/\D/g, ''));
  };

  const handleGo = () => {
    if (!canGo) return;
    setGoToValue('');
    if (targetPage !== page) onPageChange(targetPage);
  };

  const handleGoKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleGo();
    }
  };

  if (isMobile) {
    return (
      <InfiniteScroll
        dataLength={items.length}
        next={
          fetchMoreData ||
          (() => {
            console.warn('fetchMoreData callback is required for infinite scroll');
          })
        }
        hasMore={hasMore}
        loader={items?.length >= TotalCount ? '' : <h4>{t('COMMON.LOADING')}...</h4>}
        // endMessage={
        //     <p style={{ textAlign: 'center' }}>You have seen all data!</p>
        // }
      >
        {null}
      </InfiniteScroll>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      justifyContent="flex-end"
      flexWrap="wrap"
      useFlexGap
    >
      {showGoToPage && count > 1 && (
        <>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.primary, whiteSpace: 'nowrap' }}
            >
              {t('COMMON.GO_TO_PAGE', { defaultValue: 'Go to page' })}:
            </Typography>

            <TextField
              size="small"
              value={goToValue}
              onChange={handleGoToChange}
              onKeyDown={handleGoKeyDown}
              error={isOutOfRange}
              helperText={isOutOfRange ? rangeMessage : ''}
              inputProps={{
                inputMode: 'numeric',
                'aria-label': t('COMMON.GO_TO_PAGE', { defaultValue: 'Go to page' }),
                style: { textAlign: 'center', padding: '6px 8px' },
              }}
              sx={{
                width: 64,
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                // Float the message so showing it never changes the row height.
                '& .MuiFormHelperText-root': {
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  margin: '2px 0 0',
                  whiteSpace: 'nowrap',
                },
              }}
            />

            <Button
              onClick={handleGo}
              disabled={!canGo}
              sx={{
                minWidth: 64,
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: theme.palette.primary.dark },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.action.disabledBackground,
                },
              }}
            >
              {t('COMMON.GO', { defaultValue: 'Go' })}
            </Button>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
        </>
      )}

      <Pagination
        count={count}
        page={page}
        onChange={(event, value) => onPageChange(value)}
        color={color}
      />
    </Stack>
  );
};

export { NewPagination };
export default NewPagination;
