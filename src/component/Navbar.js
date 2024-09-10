import house from "../image/house.svg";
import wallet from "../image/wallet2.svg";
import calendar from "../image/calendar-week.svg";
import mortarboard from "../image/mortarboard.svg";
import threeDots from "../image/three-dots.svg";


document.getElementById("navbar").innerHTML = 
`<a class="tab" id="home" href="/">
<img src="" alt="house" id="houseIcon" />
<label for="home">Главная</label>
</a>
<a class="tab mButton" id="pay" href="/pay"
><img src="" alt="wallet" id="walletIcon"/>
<label for="pay">Баланс</label>
</a>
<a class="tab mButton" id="schedule" href="/schedule"
><img src="" alt="calendar" id="calendarIcon"/>
<label for="schedule">Расписание</label>
</a>
<a class="tab" id="item" href="/items"
><img src="." alt="mort" id="mortarboardIcon"/>
<label for="item">Предметы</label>
</a>
<a class="tab" id="another" href="/another"
><img src="" alt="dots" id="threeDotsIcon"/>
<label for="another">Еще</label>
</a>`;

document.getElementById("houseIcon").src = house;
document.getElementById("walletIcon").src = wallet;
document.getElementById("calendarIcon").src = calendar;
document.getElementById("mortarboardIcon").src = mortarboard;
document.getElementById("threeDotsIcon").src = threeDots;
