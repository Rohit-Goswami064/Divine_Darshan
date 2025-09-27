
const newImageUrl = 'https://th.bing.com/th/id/R.7a597d5c26d6c80c9a1770de2935dde6?rik=elpdFrOmUN3pRw&riu=http%3a%2f%2fwww.thehistoryhub.com%2fwp-content%2fuploads%2f2017%2f03%2fKashi-Vishwanath-Temple.jpg&ehk=uLF1dzVIUhTZ7QxBw5uhz06SVzeEBNCdQf1puUHIe3E%3d&risl=&pid=ImgRaw&r=0';

exports.temples = [
    {
        id: 1,
        nameKey: 'data.temples.vaishnoDevi.name',
        locationKey: 'data.temples.vaishnoDevi.location',
        deityKey: 'data.temples.vaishnoDevi.deity',
        famousPujaKey: 'data.temples.vaishnoDevi.famousPuja',
        imageUrl: newImageUrl,
        descriptionKey: 'data.temples.vaishnoDevi.description',
        gallery: [ newImageUrl, newImageUrl, newImageUrl ],
        pujas: [
            { id: 1, nameKey: 'data.pujas.attaDarshan.name', descriptionKey: 'data.pujas.attaDarshan.description', price: 2100 },
            { id: 2, nameKey: 'data.pujas.individualPooja.name', descriptionKey: 'data.pujas.individualPooja.description', price: 5100 },
        ],
        benefitsKey: ['data.temples.vaishnoDevi.benefits.b1', 'data.temples.vaishnoDevi.benefits.b2', 'data.temples.vaishnoDevi.benefits.b3'],
        reviewIds: [2],
        faq: [
            { questionKey: 'data.temples.vaishnoDevi.faq.q1', answerKey: 'data.temples.vaishnoDevi.faq.a1' },
            { questionKey: 'data.temples.vaishnoDevi.faq.q2', answerKey: 'data.temples.vaishnoDevi.faq.a2' },
        ]
    },
    {
        id: 2,
        nameKey: 'data.temples.tirupati.name',
        locationKey: 'data.temples.tirupati.location',
        deityKey: 'data.temples.tirupati.deity',
        famousPujaKey: 'data.temples.tirupati.famousPuja',
        imageUrl: newImageUrl,
        descriptionKey: 'data.temples.tirupati.description',
        gallery: [ newImageUrl, newImageUrl, newImageUrl ],
        pujas: [
            { id: 1, nameKey: 'data.pujas.kalyanotsavam.name', descriptionKey: 'data.pujas.kalyanotsavam.description', price: 1000 },
            { id: 2, nameKey: 'data.pujas.specialEntryDarshan.name', descriptionKey: 'data.pujas.specialEntryDarshan.description', price: 300 },
            { id: 3, nameKey: 'data.pujas.vastramSeva.name', descriptionKey: 'data.pujas.vastramSeva.description', price: 12500 },
            { id: 4, nameKey: 'data.pujas.onlineKalyanotsavam.name', descriptionKey: 'data.pujas.onlineKalyanotsavam.description', price: 2500, isEPuja: true, detailsKey: 'data.pujas.onlineKalyanotsavam.details', virtualTourLink: 'https://www.youtube.com/embed/s-b9g5j7c_I?autoplay=1', requirementsKey: 'data.pujas.onlineKalyanotsavam.requirements' }
        ],
        availablePrasads: [
            { id: 1, nameKey: 'data.prasad.tirupatiLadduBox.name', descriptionKey: 'data.prasad.tirupatiLadduBox.description', imageUrl: newImageUrl, priceMonthly: 1200, priceQuarterly: 3300 }
        ],
        benefitsKey: ['data.temples.tirupati.benefits.b1', 'data.temples.tirupati.benefits.b2', 'data.temples.tirupati.benefits.b3'],
        reviewIds: [1],
        faq: [
            { questionKey: 'data.temples.tirupati.faq.q1', answerKey: 'data.temples.tirupati.faq.a1' },
            { questionKey: 'data.temples.tirupati.faq.q2', answerKey: 'data.temples.tirupati.faq.a2' },
        ]
    },
];

exports.users = [
    { name: 'Admin', email: 'admin@divine.com', password: 'admin123', role: 'admin' },
    { name: 'Ramesh Kumar', email: 'user@divine.com', password: 'user123', role: 'user', mobile: '9876543210' },
    { name: 'Sunita Sharma', email: 'devotee@example.com', password: 'user123', role: 'user', mobile: '9123456789' },
    { name: 'Tirupati Manager', email: 'manager@divine.com', password: 'manager123', role: 'temple_manager', assignedTempleId: 2 },
];

exports.testimonials = [
    {
        id: 1,
        quote: "Divine Darshan made it possible for my elderly parents to have a peaceful darshan at Tirupati without the hassle of long queues. Truly a blessed service!",
        author: 'Ramesh Patel',
        location: 'Mumbai'
    },
    {
        id: 2,
        quote: "The E-Puja for Vaishno Devi was conducted so beautifully. I felt connected even though I was miles away. The live stream quality was excellent.",
        author: 'Sunita Sharma',
        location: 'New Delhi'
    },
];

exports.services = [
    {
        id: 1,
        titleKey: 'services.darshan.title',
        descriptionKey: 'services.darshan.description',
        icon: 'Users',
    },
     {
        id: 2,
        titleKey: 'services.epuja.title',
        descriptionKey: 'services.epuja.description',
        icon: 'Sparkles',
    },
    {
        id: 3,
        titleKey: 'services.prasad.title',
        descriptionKey: 'services.prasad.description',
        icon: 'Gift',
    },
];

exports.seasonalEvent = {
    key: 'seasonalEvent',
    data: {
        title: 'Upcoming Ganesh Chaturthi Festival',
        description: 'Join us in celebrating the birth of Lord Ganesha. Book special pujas and sevas for this auspicious occasion.',
        cta: 'Book Now for Festival',
        imageUrl: newImageUrl
    }
};
