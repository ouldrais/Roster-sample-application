import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './resource.reducer';

export const Resource = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const resourceList = useAppSelector(state => state.resource.entities);
  const loading = useAppSelector(state => state.resource.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div>
      <h2 id="resource-heading" data-cy="ResourceHeading">
        <Translate contentKey="rosterSampleApplicationApp.resource.home.title">Resources</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="rosterSampleApplicationApp.resource.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/resource/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="rosterSampleApplicationApp.resource.home.createLabel">Create new Resource</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {resourceList && resourceList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="rosterSampleApplicationApp.resource.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('key')}>
                  <Translate contentKey="rosterSampleApplicationApp.resource.key">Key</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('key')} />
                </th>
                <th className="hand" onClick={sort('firstName')}>
                  <Translate contentKey="rosterSampleApplicationApp.resource.firstName">First Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('firstName')} />
                </th>
                <th className="hand" onClick={sort('lastName')}>
                  <Translate contentKey="rosterSampleApplicationApp.resource.lastName">Last Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lastName')} />
                </th>
                <th className="hand" onClick={sort('teamRole')}>
                  <Translate contentKey="rosterSampleApplicationApp.resource.teamRole">Team Role</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('teamRole')} />
                </th>
                <th className="hand" onClick={sort('exchangeAllowed')}>
                  <Translate contentKey="rosterSampleApplicationApp.resource.exchangeAllowed">Exchange Allowed</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('exchangeAllowed')} />
                </th>
                <th>
                  <Translate contentKey="rosterSampleApplicationApp.resource.team">Team</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {resourceList.map((resource, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/resource/${resource.id}`} color="link" size="sm">
                      {resource.id}
                    </Button>
                  </td>
                  <td>{resource.key}</td>
                  <td>{resource.firstName}</td>
                  <td>{resource.lastName}</td>
                  <td>{resource.teamRole}</td>
                  <td>{resource.exchangeAllowed ? 'true' : 'false'}</td>
                  <td>{resource.team ? <Link to={`/team/${resource.team.id}`}>{resource.team.key}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/resource/${resource.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/resource/${resource.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/resource/${resource.id}/delete`)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="rosterSampleApplicationApp.resource.home.notFound">No Resources found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Resource;
