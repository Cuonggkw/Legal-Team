"use strict";

/* Package System */
import React from "react";

/* Package Application */
import {fetchApi} from '@helpers/Common';
import CardBody from "@views/Default/Components/CardBody";
import { Box, FormControl } from "@mui/material";
import Image from "next/image";
import { Router } from "next/router";

class Events extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
    this.state={
      module: "events",
      isLoading: false,
      isSort: "desc",
      isSorting: props.sort ? props.sort : "created_at",
      data: [],
      values: {},
      limit: props?.limit ?? 20,
      page: this.props.router?.query?.page
        ? Number(this.props.router.query.page)
        : 1,
      total: 0,
      next: "",
      filter: "",
    }
	}

	componentDidMount() {
		this._isMounted = true;
    this.getData()
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

  getData = async (filter = null) => {

    if (this.state.module != "" && !this.props?.router?.query?.token) {
      try {
        let _filter = "";
        let _fq = "";
        let _fqRange = "";
        if (filter?.page && filter?.page > 0)
          await this.setState({ page: filter?.page });
        _filter += "?sort=" + (this.state.isSort == "desc" ? "-" : "") + this.state.isSorting;
        _filter += "&limit=" + this.state.limit +"&offset=" + (this.state.page - 1) * this.state.limit;
        this.setState({ isLoading: true });
        if (filter != null && !filter?.page)
          await this.setState({ values: { ...this.state.values, ...filter } });
        for (const [key, value] of Object.entries(this.state.values)) {
          if (value != "") {
            switch (key) {
              case "search":
              case "tags":
                switch (this.state.module) {
                  case "videos":
                    if (this.state.values[key])
                      _filter +=
                        "&fqtext=" +
                        this.state.values[key] +
                        (this.props?.search_fields
                          ? "|" + this.props?.search_fields
                          : "");
                    break;
                  default:
                    if (this.state.values[key])
                      _filter +=
                        "&s=" +
                        this.state.values[key] +
                        (this.props?.search_fields
                          ? "|" + this.props?.search_fields
                          : "");
                    break;
                }
                break;
              case "range":
                if (this.state.values[key]) {
                  if (_fqRange == "")
                    _fqRange = "&fqrange=" + this.state.values[key];
                  else _fqRange = "," + this.state.values[key];
                  _filter += _fqRange;
                }
                break;
              case "month":
                if (this.state.values[key])
                  _filter += "&month=" + this.state.values[key];
                break;
              case "start":
                if (this.state.values[key])
                  _filter += "&start=" + this.state.values[key];
                break;
              case "from":
                if (this.state.values[key])
                  _filter += "&from=" + this.state.values[key];
                break;
              case "end":
                if (this.state.values[key])
                  _filter += "&end=" + this.state.values[key];
                break;
              case "to":
                if (this.state.values[key])
                  _filter += "&to=" + this.state.values[key];
                break;
              case "age_from":
                if (this.state.values[key]) {
                  let _ageFrom =
                    new Date().getFullYear() - this.state.values[key];
                  if (_fqRange == "")
                    _fqRange = "&fqrange=birth_day:lte" + _ageFrom;
                  else _fqRange = ",birth_day:lte" + _ageFrom;
                  _filter += _fqRange;
                }
                break;
              case "age_to":
                if (this.state.values[key]) {
                  let _ageTo =
                    new Date().getFullYear() - this.state.values[key];
                  if (_fqRange == "")
                    _fqRange = "&fqrange=birth_day:gte" + _ageTo;
                  else _fqRange = ",birth_day:gte" + _ageTo;
                  _filter += _fqRange;
                }
                break;
              case "authorize_identity_auth":
                if (this.state.values[key] == "true")
                  _filter += "&fqnot=authorize_identity_auth:null";
                else _filter += "&fqnull=authorize_identity_auth";
                break;
              default:
                let _findIndex = _.findIndex(this.props.filters, { key: key });
                if (this.props?.filters?.[_findIndex]?.type == "autoComplete") {
                  _filter += `&fqin=${key}:${
                    typeof this.state.values[key] == "string"
                      ? [this.state.values[key]]
                      : this.state.values[key]
                  }`;
                } else {
                  if (
                    [
                      "platform",
                      "subscribers_from",
                      "subscribers_to",
                      "authen",
                    ].includes(key) &&
                    this.state.module == "influencers"
                  )
                    _filter += `&${key}=${value}`;
                  else
                    _fq = _fq
                      ? (_fq += "," + key + ":" + this.state.values[key])
                      : "&fq=" + key + ":" + this.state.values[key];
                  break;
                }
            }
          }
        }
        if (_fq) _filter += _fq;
        if (this.state.next != "") _filter += "&next=" + this.state.next;
        let _url = "";
        switch (this.state.module) {
          case "events":
            if (this.props.slug) {
              _filter=''
              _url = process.env.API_URL + "get-poll-by-event/"+this.props.slug;
            }
            else {
              _url = process.env.API_URL + 'get-event';
              _filter += `&fq=status:1&fqn=deleted_at`
            }
            break;
          case "polls":
            if (this.props.slug) {
              _url = process.env.API_URL + "get-poll-item-by-poll/"+ this.props.slug;
              _filter = ``
            }
            else {
              _url = process.env.API_URL + "get-poll-by-event";
              _filter += `&fq=status:1&fqn=deleted_at`
            }
            break;
          case "poll-items":
            if (this.props.slug) {
              _filter = '';
              _url = process.env.API_URL + "get-poll-item/" + this.props.slug;
            }
            else {
              _url = process.env.API_URL + "get-poll-by-event";
              _filter += `&fq=status:1&fqn=deleted_at`
            }
            break;
          default:
            _url = process.env.API_URL + this.state.module;
            break;
        }

        this.setState({ filter: _filter });
        let _data = null;
        _data = await fetchApi( _url + _filter ).then(response=>response?.data ?? {});
        // if (_data?.response?.data?.status == "error") {
        //   this.props.handleFailure(
        //     _data?.response?.data?.errors?.msg ??
        //       "Server Error, Please try again later"
        //   );
        // }

        if (_data?.status == "success")
          this._isMounted &&
            this.setState({
              isLoading: false,
              data: this.state.module == 'poll-items' ? [_data.data] : _data.data,
              event: _data?.event ?? _data?.poll,
              total: _data?.total ?? 0,
            });
      } catch (e) {
        console.log(e);
      }
    }
  };

	render(){
    const {data} = this.state
		return(
			<React.Fragment>
        <section className="sl-section" style={{color:'white'}}>
          <div className="container">
            <div className="cardFilter">
              <div
                className={`card cardC`}
              >
                <div className={`card-title card-${this.state.module}`}>
                  {this.props.nameDisplay ?? 'Event'}
                </div>
                {/* <div className={`card-search card-${this.state.module}`}>
              {search}
            </div> */}
                <div className="cardAll">
                  <div className="cardFlex">
                    {data?.length > 0 &&
                      data.map((result, k) => (
                        <div
                          className="cardCard"
                          data-id={result.id}
                          data-title="Danh sách bình chọn"
                          data-width={this.props.maxWidthPopup}
                          data-type={
                            this.props.type ? this.props.type : "default"
                          }
                          data-scroll="body"
                          key={k}
                          onClick={(e) => {
                            if (this.state.module == 'poll-items')
                              return
                            if (this.state.module == 'events' && this.props.slug) {
                              // this.handleDetailLayout(e)
                              Router.push(`polls/${result.id}`)
                            }
                            else if (this.state.module == 'polls' && this.props.slug) {
                              Router.push(`poll-items/${result.id}`)
                            }
                            else Router.push(`events/${result.id}`)
                          }}
                        >
                          <div className="cardMain">
                            <div className="cardLeft">
                              <Image
                                alt=""
                                src={`${result?.image ? process.env.CDN_URL_S3 +
                                  result.image
                                  : `/images/${this.state.module == 'events' && this.props.slug ? 'polls' : this.state.module == 'polls' && this.props.slug ? 'poll-items' : this.state.module}.png`
                                  }`}
                                objectFit='contain'
                                width={188}
                                height={188}
                                quality={100}
                              />
                            </div>
                            <div className="cardRight">
                              <div className="cardTitleT">
                                <h2>{result.title || result.name}</h2>

                              </div>
                              <CardBody
                                authen={this.props.stateAccount?.access_token}
                                updated={result?.updated_at}
                                start_date={this.state.module == 'events' && !this.props.slug ? result?.created_at : ''}
                                end_date={this.state.module == 'events' && !this.props.slug ? result?.ended_at : ''}
                                created_by={result?.creator?.email}
                                count_vote={result.count_us ?? 10}
                                count_comment={result.count_comment ?? 10}
                                vote={this.props.vote}
                                isVote={result?.isVote}
                                handleVote={async () => {
                                  if (this.props.stateAccount.access_token)
                                    fetchApi(process.env.API_URL + `check-user-poll/${result.poll_id}`, this.props.stateAccount.access_token).then(res => {
                                      if (res?.data?.id) {
                                        this.props.setConformLayout({ status: true, poll_item_id: result.id });
                                      }
                                      else {
                                        postApi(process.env.API_URL + 'vote', { poll_item_id: result.id }, this.props.stateAccount.access_token).then(res => {
                                          if (res?.response?.data?.status == 'error')
                                            this.props.handleFailure(res?.response?.data?.errors?.[0]?.msg ?? 'Bình chọn đã được đánh giá')
                                          else {
                                            this.props.handleSuccess('Bình chọn thành công')
                                            this.getData()
                                          }
                                        })
                                      }
                                    })
                                  else {
                                    this.props.setPopupLogin({ status: true, title: 'Đăng nhập' });
                                  }
                                }}
                                url={result?.url}
                                description={this.props.vote ? result.description : ''}
                              />
                            </div>
                          </div>
                          {this.props.vote && <CardFooter
                            authen={this.props.stateAccount?.access_token}
                            returnlogin={() => {
                              this.props.setPopupLogin({ status: true, title: 'Đăng nhập' });
                            }}
                            handleComment={(content) => {
                              if (content.length > 500) {
                                this.props.handleFailure('Không vượt quá 500 kí tự');
                                return;
                              }
                              return new Promise((resolve) => {
                                postApi(process.env.API_URL + 'user-comments', { poll_item_id: result.id, content }, this.props.stateAccount.access_token).then(res => {
                                  if (res?.response?.data?.status == 'error') {
                                    this.props.handleFailure(res?.response?.data?.errors?.msg ?? res?.response?.data?.errors?.[0]?.msg ?? 'Bình luận thất bại')
                                    resolve(false);
                                  }
                                  let data = this.state.data?.[0]
                                  if (data) {
                                    data.count_comment += 1;
                                  }
                                  this.setState({ ...this.state, data: [data] })
                                  resolve(true)
                                })
                              })

                            }}
                            getData={(filter = '') => fetchApi(process.env.API_URL + `user-comments?fq=poll_item_id:${result.id},status:1&fqn=deleted_at&${filter}`, this.props.stateAccount.access_token)}
                          />}
                        </div>
                      ))}
                  </div>
                  {/* {(data?.length > 0 && !this.props.vote) && (
                    <div className="card-footer">
                      <div className="d-flex justify-content-between wp-100">
                        <div className="listBox">
                          <Box sx={{ minWidth: 75 }}>
                            <FormControl
                              fullWidth
                              className="selectCustom bgGray"
                            >
                              <Select
                                id="limit-select"
                                name='name'
                                value={this.state.limit}
                                onChange={this.handleChangeLimit}
                              >
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="20">20</MenuItem>
                                <MenuItem value="40">40</MenuItem>
                                <MenuItem value="100">100</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </div>

                        {total > limit && (
                          <Stack spacing={2} className="pagination">
                            <Pagination
                              count={
                                Math.ceil(total / limit) >
                                  Math.ceil(10000 / limit)
                                  ? Math.ceil(10000 / limit)
                                  : Math.ceil(total / limit)
                              }
                              shape="rounded"
                              onChange={this.handlePagination}
                              page={this.state.page}
                            />
                          </Stack>
                        )}
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </section>
			</React.Fragment>
		)
	}
}
export default Events;