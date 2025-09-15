import './LandPage.css'

const LandPage = () => {

    const components = {
        nav: ['Subjects', 'Courses', 'Degrees', 'ForBusiness'],
        auth: ['Login', 'SignUp'],
        stats: [
             {
                field: "Education",
                title: "subjects",
                plus: "+40"
            },
            {
                field: "Online",
                title: "courses",
                plus: "+300"
            },
            {
                field: "5 star",
                title: "learner reviews",
                plus: "+180k"
            }

        ]
    }

    return (
        < div className='body'>
            <nav className='nav'>
                <h1 className='logo'><span>Learn</span>ify</h1>
                <ul className='nav-links'>
                    {components.nav.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <ul className='auth-links'>
                    {components.auth.map((item) => (
                        <button key={item} className='btn'>{item}</button>
                    ))}
                </ul>
            </nav>
            <div className='main-section'>
                <h1 className='main-heading'>Find the right<br /> <span>course</span> for you</h1>
                <p className='sub-heading'>See your personalised recommendations</p>
                <div>
                    <button className='btn'>Find course</button>
                    <button className='btn'>View our blog</button>
                </div>
                <div >
                    {components.stats.map((stat, index) => {
                        return (
                            <div className='stats'>
                                <div className='stat' key={index}>
                                    <span className='field-name'>{stat.field}</span>
                                    <p>{stat.title}</p>
                                    <h2>{stat.plus}</h2>
                                </div>
                            </div>
                        )
                    })}
                </div>
                    
            </div>


            </div >
            )
}

            export default LandPage