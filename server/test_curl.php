<?php
data=""\
"code=4/Rw6A9raJQ3PrPWL0Q9z49guYu89FZoz322RySVFtzNc&"\
"client_id=230452130504-3uca1rp4ntlh06hdnsdbj50sqagaqfkt.apps.googleusercontent.com&"\
"client_secret=qawsWCd3J6HTRvnqsjYUpgH9&"\
"redirect_uri=urn:ietf:wg:oauth:2.0:oob&"\
"grant_type=authorization_code"

curl --data $data "https://accounts.google.com/o/oauth2/token"
?>