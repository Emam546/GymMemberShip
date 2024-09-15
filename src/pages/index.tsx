import { BigCard } from "@src/components/card";

import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <BigCard>
        <div>
          {/*  Row 1 */}
          <div className="row">
            <div className="col-lg-8 d-flex align-items-strech">
              <div className="card w-100">
                <div className="card-body">
                  <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                    <div className="mb-3 mb-sm-0">
                      <h5 className="card-title fw-semibold">Sales Overview</h5>
                    </div>
                    <div>
                      <select className="form-select">
                        <option value={1}>March 2023</option>
                        <option value={2}>April 2023</option>
                        <option value={3}>May 2023</option>
                        <option value={4}>June 2023</option>
                      </select>
                    </div>
                  </div>
                  <div id="chart" />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  {/* Yearly Breakup */}
                  <div className="overflow-hidden card">
                    <div className="p-4 card-body">
                      <h5 className="card-title mb-9 fw-semibold">
                        Yearly Breakup
                      </h5>
                      <div className="row align-items-center">
                        <div className="col-8">
                          <h4 className="mb-3 fw-semibold">$36,358</h4>
                          <div className="mb-3 d-flex align-items-center">
                            <span className="me-1 rounded-circle bg-light-success round-20 d-flex align-items-center justify-content-center">
                              <i className="ti ti-arrow-up-left text-success" />
                            </span>
                            <p className="mb-0 text-dark me-1 fs-3">+9%</p>
                            <p className="mb-0 fs-3">last year</p>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="me-4">
                              <span className="round-8 bg-primary rounded-circle me-2 d-inline-block" />
                              <span className="fs-2">2023</span>
                            </div>
                            <div>
                              <span className="round-8 bg-light-primary rounded-circle me-2 d-inline-block" />
                              <span className="fs-2">2023</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="d-flex justify-content-center">
                            <div id="breakup" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  {/* Monthly Earnings */}
                  <div className="card">
                    <div className="card-body">
                      <div className="row alig n-items-start">
                        <div className="col-8">
                          <h5 className="card-title mb-9 fw-semibold">
                            {" "}
                            Monthly Earnings{" "}
                          </h5>
                          <h4 className="mb-3 fw-semibold">$6,820</h4>
                          <div className="pb-1 d-flex align-items-center">
                            <span className="me-2 rounded-circle bg-light-danger round-20 d-flex align-items-center justify-content-center">
                              <i className="ti ti-arrow-down-right text-danger" />
                            </span>
                            <p className="mb-0 text-dark me-1 fs-3">+9%</p>
                            <p className="mb-0 fs-3">last year</p>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="d-flex justify-content-end">
                            <div className="p-6 text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center">
                              <i className="ti ti-currency-dollar fs-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="earning" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 d-flex align-items-stretch">
              <div className="card w-100">
                <div className="p-4 card-body">
                  <div className="mb-4">
                    <h5 className="card-title fw-semibold">
                      Recent Transactions
                    </h5>
                  </div>
                  <ul className="mb-0 timeline-widget position-relative mb-n5">
                    <li className="overflow-hidden timeline-item d-flex position-relative">
                      <div className="flex-shrink-0 timeline-time text-dark text-end">
                        09:30
                      </div>
                      <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-primary" />
                        <span className="flex-shrink-0 timeline-badge-border d-block" />
                      </div>
                      <div className="timeline-desc fs-3 text-dark mt-n1">
                        Payment received from John Doe of $385.90
                      </div>
                    </li>
                    <li className="overflow-hidden timeline-item d-flex position-relative">
                      <div className="flex-shrink-0 timeline-time text-dark text-end">
                        10:00 am
                      </div>
                      <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-info" />
                        <span className="flex-shrink-0 timeline-badge-border d-block" />
                      </div>
                      <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                        New sale recorded{" "}
                        <a
                          href="javascript:void(0)"
                          className="text-primary d-block fw-normal"
                        >
                          #ML-3467
                        </a>
                      </div>
                    </li>
                    <li className="overflow-hidden timeline-item d-flex position-relative">
                      <div className="flex-shrink-0 timeline-time text-dark text-end">
                        12:00 am
                      </div>
                      <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-success" />
                        <span className="flex-shrink-0 timeline-badge-border d-block" />
                      </div>
                      <div className="timeline-desc fs-3 text-dark mt-n1">
                        Payment was made of $64.95 to Michael
                      </div>
                    </li>
                    <li className="overflow-hidden timeline-item d-flex position-relative">
                      <div className="flex-shrink-0 timeline-time text-dark text-end">
                        09:30 am
                      </div>
                      <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-warning" />
                        <span className="flex-shrink-0 timeline-badge-border d-block" />
                      </div>
                      <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                        New sale recorded{" "}
                        <a
                          href="javascript:void(0)"
                          className="text-primary d-block fw-normal"
                        >
                          #ML-3467
                        </a>
                      </div>
                    </li>
                    <li className="overflow-hidden timeline-item d-flex position-relative">
                      <div className="flex-shrink-0 timeline-time text-dark text-end">
                        09:30 am
                      </div>
                      <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-danger" />
                        <span className="flex-shrink-0 timeline-badge-border d-block" />
                      </div>
                      <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                        New arrival recorded
                      </div>
                    </li>
                    <li className="overflow-hidden timeline-item d-flex position-relative">
                      <div className="flex-shrink-0 timeline-time text-dark text-end">
                        12:00 am
                      </div>
                      <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                        <span className="flex-shrink-0 my-8 border border-2 timeline-badge border-success" />
                      </div>
                      <div className="timeline-desc fs-3 text-dark mt-n1">
                        Payment Done
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-8 d-flex align-items-stretch">
              <div className="card w-100">
                <div className="p-4 card-body">
                  <h5 className="mb-4 card-title fw-semibold">
                    Recent Students
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BigCard>
    </>
  );
}
