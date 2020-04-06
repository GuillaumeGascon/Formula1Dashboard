import React from 'react';

import SideMenu from '../components/sideMenu';
import SettingsComponents from '../components/settings';

import '../App.css';

function Settings() {
  return (

    <>

        <div className="App">


          <SideMenu/>

          <div className='container'>

            <SettingsComponents/>

          </div>


        </div>

    </>

  );
}

export default Settings;
