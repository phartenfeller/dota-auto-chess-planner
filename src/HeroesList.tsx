import * as React from 'react';

import { ascend, prop, descend, sortWith } from 'ramda';

import {
  heroes,
  HeroType,
  getFeaturesCount,
  HeroNamesType,
  heroNamesToString,
  getFeaturesList,
} from './heroes';
import { colors } from './colors';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

type SortableColumnType = 'name' | 'species' | 'class' | 'cost';

const Feature = ({
  name,
  highlight,
}: {
  name: string;
  highlight?: boolean;
}) => (
    <span
      style={{
        color: colors.features[name],
        borderWidth: '1',
        borderColor: colors.features[name],
        borderStyle: highlight ? 'solid' : 'none',
      }}
    >
      {name}
    </span>
  );

const getHeroesComparators = (
  column: SortableColumnType,
  sortAscending: boolean
) => {
  switch (column) {
    case 'name':
      return [sortAscending ? ascend(prop('name')) : descend(prop('name'))];
    case 'species':
      return [
        sortAscending
          ? ascend(({ species }) => species[0])
          : descend(({ species }) => species[0]),
        ascend(prop('cost')),
      ];
    case 'class':
      return [
        sortAscending ? ascend(prop('className')) : descend(prop('className')),
        ascend(prop('cost')),
      ];
    default:
      return [
        sortAscending ? ascend(prop('cost')) : descend(prop('cost')),
        ascend(prop('name')),
      ];
  }
};

interface heroTablesInput {
  heroes: Array<HeroType>;
  pickedHeroes: HeroNamesType;
  onPickedHeroesChange: (newPickedHeroes: HeroNamesType) => void;
  onSort: (column: SortableColumnType) => void;
  search: string;
}

const HeroesTable: any = ({
  heroes,
  pickedHeroes,
  onPickedHeroesChange,
  onSort,
  search
}: heroTablesInput) => {
  const features = getFeaturesList(pickedHeroes);
  const handleHeroClick = (heroName: HeroType['name']) => {
    const index = pickedHeroes.indexOf(heroName);

    if (index === -1) {
      onPickedHeroesChange([...pickedHeroes, heroName]);
    } else {
      const newPickedHeroes = [...pickedHeroes];

      newPickedHeroes.splice(index, 1);

      onPickedHeroesChange(newPickedHeroes);
    }
  };
  /*
  render() {
    const { heroes, pickedHeroes, onSort, search } = this.props;
  */
  return (
    <table style={{ width: '100%' }}>
      <thead style={{ color: 'White' }}>
        <tr style={{ display: 'flex', width: '100%' }}>
          <th
            onClick={() => {
              onSort('name');
            }}
            style={{ flex: 4 }}
          >
            Name
            </th>
          <th
            onClick={() => {
              onSort('species');
            }}
            style={{ flex: 3 }}
          >
            Species
            </th>
          <th
            onClick={() => {
              onSort('class');
            }}
            style={{ flex: 3 }}
          >
            Class
            </th>
          {/* <th>Ability</th> */}
          <th
            onClick={() => {
              onSort('cost');
            }}
            style={{ flex: 1 }}
          >
            Cost
            </th>
        </tr>
      </thead>

      <tbody>
        {heroes.map(({ name, species, className, cost }) => (
          <tr
            key={name}
            onClick={() => {
              handleHeroClick(name);
            }}
            style={{
              backgroundColor:
                pickedHeroes.indexOf(name) === -1 ? 'Black' : 'DarkSlateGrey',
              display: 'flex',
            }}
          >
            <td
              style={{
                color: colors.cost[cost],
                fontWeight: 'bold',
                flex: 4,
              }}
              className={
                search !== '' &&
                  name.toLowerCase().includes(search.toLowerCase())
                  ? 'highlight'
                  : ''
              }
            >
              {name}
            </td>
            <td style={{ flex: 3 }}>
              {species.map(speciesName => (
                <React.Fragment key={speciesName}>
                  <Feature
                    name={speciesName}
                    highlight={features.indexOf(speciesName) !== -1}
                  />{' '}
                </React.Fragment>
              ))}
            </td>
            <td style={{ flex: 3 }}>
              <Feature
                name={className}
                highlight={features.indexOf(className) !== -1}
              />
            </td>
            {/* <td> </td> */}
            <td style={{ color: 'White', flex: 1 }}>{cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type HeroesListState = {
  sortBy: SortableColumnType;
  sortAscending: boolean;
  search: string;
};

class HeroesList extends React.Component<
  RouteComponentProps<{}> & {
    pickedHeroes: HeroNamesType;
  },
  HeroesListState
  > {
  state: HeroesListState = {
    sortBy: 'cost',
    sortAscending: true,
    search: '',
  };

  updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value;
    this.setState({ search: searchString });
  };

  handlePickedHeroesChange = (newPickedHeroes: HeroNamesType) => {
    const {
      location: { pathname },
    } = this.props;

    this.props.history.push(
      `${pathname}?heroes=${heroNamesToString(newPickedHeroes)}`
    );
  };

  handleSort = (column: SortableColumnType) => {
    this.setState(({ sortBy, sortAscending }) => ({
      sortBy: column,
      sortAscending: sortBy === column ? !sortAscending : sortAscending,
    }));
  };

  render() {
    const { sortBy, sortAscending } = this.state;
    const {
      pickedHeroes,
      location: { pathname },
    } = this.props;

    return (
      <div style={{ width: '100%' }}>
        <h2 style={{ color: 'White' }}>
          Click on heroes to add/remove them to/from your team. Click on column
          names to sort the list. Copy link from the address bar to share your
          lineup.
        </h2>
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <Link to={pathname} className="clear-btn">
            <span className="vertical-middle">Clear lineup </span>
            <i className="material-icons clear-icon vertical-middle">cancel</i>
          </Link>
          <form className="search-form">
            <input
              type="text"
              placeholder="Search"
              value={this.state.search}
              onChange={this.updateSearch}
              className="searchbar"
            />
            <i className="search-icon material-icons">search</i>
          </form>
          <h3 style={{ color: '#bfbfbf', paddingRight: "25px" }}>Last patch: 2018/02/05</h3>
        </div>
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <HeroesTable
              heroes={
                sortWith(
                  getHeroesComparators(sortBy, sortAscending),
                  heroes
                ).slice(0, Math.ceil(heroes.length / 2)) as Array<HeroType>
              }
              pickedHeroes={pickedHeroes}
              onPickedHeroesChange={this.handlePickedHeroesChange}
              onSort={this.handleSort}
              search={this.state.search}
            />
          </div>
          <div style={{ flex: 1 }}>
            <HeroesTable
              heroes={
                sortWith(
                  getHeroesComparators(sortBy, sortAscending),
                  heroes
                ).slice(Math.ceil(heroes.length / 2), heroes.length) as Array<
                  HeroType
                >
              }
              pickedHeroes={pickedHeroes}
              onPickedHeroesChange={this.handlePickedHeroesChange}
              onSort={this.handleSort}
              search={this.state.search}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'White' }}>
              <h2>Team size: {pickedHeroes.length}</h2>

              {getFeaturesCount(pickedHeroes).map(
                ({ feature, count, activePerks }) => (
                  <div key={feature} style={{ margin: '10px' }}>
                    <Feature name={feature} /> x {count}
                    {activePerks.map(({ requiredCount, description }) => (
                      <div key={requiredCount}>
                        ({requiredCount}): {description}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const HeroesListWithRouter = withRouter(HeroesList);