import React from 'react'
import styles from './youtube.module.scss';
import AddyoutubeVideo from './addyoutubeVideo';
const Banner = '/assets/images/banner1.png';
export default function Youtube() {
    return (
        <div className={styles.youtubePageAlignment}>
            <div className={styles.grid}>
                {
                    [...Array(6)].map((_, index) => {
                        return (
                            <div className={styles.griitems} key={index}>
                                <div className={styles.image}>
                                    <img src={Banner} alt='Banner' />
                                </div>
                                <h3>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                </h3>
                            </div>
                        )
                    })
                }
            </div>
            <AddyoutubeVideo />
        </div>
    )
}
