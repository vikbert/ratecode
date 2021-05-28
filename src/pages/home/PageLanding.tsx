import React from 'react';
import OverflowHeader from '../../components/header/OverflowHeader';
import HeroHeader from './HeroHeader';
import HeroFooter from './HeroFooter';
import HeroBody from './HeroBody';
import Footer from '../../components/footer/Footer';

export default function PageLanding(): JSX.Element {
  return (
    <>
      <OverflowHeader />
      <div className="container wmx100 w100 p-ff-source">
        <div
          id="content"
          className="w100 wmx100 p0 snippet-hidden bg-black-025 snippet-hidden"
        >
          <HeroHeader />
          <HeroBody />
          <HeroFooter />
        </div>
      </div>
      <Footer />
    </>
  );
}
