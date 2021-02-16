import React, { useEffect } from 'react';
import useEffectCustom from '../../customHooks/useEffectCustom';
import { Button, InputLabel, Select, FormControl, MenuItem } from '@material-ui/core';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import type { Genre } from './MainContent';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../stores/rootReducer';
import { createURL, setGenre } from '../../stores/shopInfomation';
import { fetchPosition, fetchGenreList, fetchShopList } from '../../stores/shopInfomation'
import NarrowDown from './NarrowDown';

export default function SelectGenre() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        position,
        genre,
        url,
        genreList
    } = useSelector((state: RootState) => state.shopInfomation);

    // 経度緯度情報を取得
    const getLocationInfo = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(fetchPosition());
    };

    // 経度、緯度が更新されたらお店取得URLを作成
    useEffectCustom(() => {
        dispatch(createURL());
        // TODO: (警告が出る)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    // URLが更新されたらお店の情報を取得
    useEffectCustom(() => {
        dispatch(fetchShopList(url));
        // TODO: (警告が出る)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    // ジャンルが変更された際の処理
    const changedgenre = (event: React.ChangeEvent<{ name?: string | undefined, value: any | string }>) => {
        dispatch(setGenre(event.target.value));
    };

    // ジャンル取得
    useEffect(() => {
        dispatch(fetchGenreList());
        // TODO: (警告が出る)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => getLocationInfo(event)} className={classes.selectSection}>
                <Grid container spacing={3} alignItems="center" justify="center">
                    <Grid item xs='auto'>
                        <FormControl className={classes.formControl} variant="outlined">
                            {/* TODO: (警告が出る) */}
                            <InputLabel htmlFor="select" color="primary" id="label">ジャンル</InputLabel>
                            <Select
                                data-testid="select"
                                id="select"
                                labelId="label"
                                label='ジャンル'
                                value={genre}
                                onChange={(event: React.ChangeEvent<{ name?: string | undefined, value: any | string }>) => changedgenre(event)}
                                required
                            >
                                {genreList.map((output: Genre, index: number) => (
                                    <MenuItem key={index} value={output.code}> {output.name} </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs='auto'>
                        <NarrowDown />
                    </Grid>
                    <Grid item xs='auto'>
                        <Button data-testid="seachButton" type="submit" variant="contained" className={classes.sendButton}>
                            現在地よりお店を検索
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}

// CSS-in-JS
const useStyles = makeStyles((theme: Theme) => ({
    formControl: {
        margin: theme.spacing(5),
        minWidth: 150,
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: '#fff'
    },
    sendButton: {
        margin: "12px 0",
        width: "100%",
        height: 45,
        marginLeft: "auto",
        marginRight: "auto",
    },
    narrowDown: {
        width: '250px',
        margin: '30px',
        padding: '30px',
    },
    selectSection: {
        backgroundColor: '#fff'
    }
}));
