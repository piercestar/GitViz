import sys,json,datetime,time,csv

output = open("monthly_sums.csv","wb");
writer = csv.writer(output);

with open('contributors.txt') as data_file :
	data = json.load(data_file)

writer.writerow(('month','additions','deletions'))
month_str = ['January','February','March','April','May','June']

for month in range(1,7):
	start = int(datetime.datetime(2016,month,1,0,0).strftime('%s'))
	end = int(datetime.datetime(2016,month+1,1,0,0).strftime('%s'))
	additions = 0
	deletions = 0
	count = 0
	for author in data:
		if (count == 0) :
			count+=1;
		else:
			print author['author']['login']
			for weeks in author['weeks'] :
				if weeks['w'] >= start and weeks['w'] < end :
					if (weeks['a'] > 0):
						print  str(weeks['a']) + ", " + str(weeks['w']) + ", " + month_str[month-1]
					additions += weeks['a']
					deletions += weeks['d']
	row = [month_str[month-1],str(additions),str(deletions)];
	writer.writerow(row)
	print "additions: " + str(additions) + "," + "deletions: " + str(deletions)
