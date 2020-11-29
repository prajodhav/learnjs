let var1 = [10,2,3];console.log(var1.sort(function(a,b){return a -b;}));
[10,2,3].sort(function(a,b){return a -b;});
eval (" try { " + var2 + " } catch (e) { return e.message; }");

try { eval("[10,2,3].sort(function(a'',b){return a -b;});"); } catch (e) { console.log(e.message)};

