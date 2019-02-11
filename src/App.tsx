import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import * as queryString from 'query-string';

import { stringToHeroNames } from './heroes';
import { HeroesListWithRouter } from './HeroesList';

const App = () => {
  return (
    <div
      className="App"
    >
      <BrowserRouter>
        <Route
          path="/"
          render={({ location: { search } }) => {
            const { heroes: heroesString } = queryString.parse(search);

            if (!heroesString || typeof heroesString !== 'string') {
              return <HeroesListWithRouter pickedHeroes={[] as Array<string>} />;
            }

            return (
              <HeroesListWithRouter
                pickedHeroes={stringToHeroNames(heroesString) as Array<string>}
              />
            );
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App as React.FunctionComponent;
