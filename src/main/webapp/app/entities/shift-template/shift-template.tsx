import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './shift-template.reducer';

export const ShiftTemplate = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const shiftTemplateList = useAppSelector(state => state.shiftTemplate.entities);
  const loading = useAppSelector(state => state.shiftTemplate.loading);

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
      <h2 id="shift-template-heading" data-cy="ShiftTemplateHeading">
        <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.home.title">Shift Templates</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/shift-template/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.home.createLabel">Create new Shift Template</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {shiftTemplateList && shiftTemplateList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.id">ID</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('key')}>
                  <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.key">Key</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('key')} />
                </th>
                <th className="hand" onClick={sort('shiftStart')}>
                  <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.shiftStart">Shift Start</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('shiftStart')} />
                </th>
                <th className="hand" onClick={sort('shiftEnd')}>
                  <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.shiftEnd">Shift End</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('shiftEnd')} />
                </th>
                <th className="hand" onClick={sort('type')}>
                  <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.type">Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('type')} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shiftTemplateList.map((shiftTemplate, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/shift-template/${shiftTemplate.id}`} color="link" size="sm">
                      {shiftTemplate.id}
                    </Button>
                  </td>
                  <td>{shiftTemplate.key}</td>
                  <td>
                    {shiftTemplate.shiftStart ? <TextFormat type="date" value={shiftTemplate.shiftStart} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {shiftTemplate.shiftEnd ? <TextFormat type="date" value={shiftTemplate.shiftEnd} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{shiftTemplate.type}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/shift-template/${shiftTemplate.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/shift-template/${shiftTemplate.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/shift-template/${shiftTemplate.id}/delete`)}
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
              <Translate contentKey="rosterSampleApplicationApp.shiftTemplate.home.notFound">No Shift Templates found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ShiftTemplate;
