import React from 'react';
import { connect } from 'react-redux';

class Footer extends React.Component {
    render() {
        const system = this.props.system ?
            this.props.system : { todayViews: 0, allViews: 0, address: 0, email: 0, mobile: 0 };

        return (
            <footer className='footer'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-6 col-md-6'>
                            <h4>Lượt truy cập</h4>
                            <p>
                                Lượt truy cập hôm nay: {system.todayViews}<br />
                                Tất cả chuyến thăm: {system.allViews}
                            </p>
                        </div>
                        <div className='col-sm-6 col-md-6'>
                            <h4>TRUNG TÂM HỖ TRỢ SINH VIÊN VÀ VIỆC LÀM</h4>
                            <p>
                                {system.address}}<br />
                                Email: {system.email} | Điện thoại: {system.mobile}}
                            </p>
                        </div>
                    </div>
                </div>
            </footer >
        );
    }
}

const mapStateToProps = state => ({
    system: state.system
});
const mapActionsToProps = {
};
export default connect(mapStateToProps, mapActionsToProps)(Footer);