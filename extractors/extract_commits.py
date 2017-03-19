import sys,json,datetime,time,csv

output = open("commit_data.csv","wb");
writer = csv.writer(output);

with open('contributors.txt') as data_file :
	data = json.load(data_file)

start = int(datetime.datetime(2016,6,1,0,0).strftime('%s'))
end = int(datetime.datetime(2016,7,1,0,0).strftime('%s'))

writer.writerow(('author','commits'))

for author in data:
	commits = 0;
	for weeks in author['weeks'] :
		if weeks['w'] >= start and weeks['w'] < end :
			if (weeks['c'] > 0):
			commits += weeks['c'];
	row = [str(author['author']['login']),str(commits)];
	writer.writerow(row)
